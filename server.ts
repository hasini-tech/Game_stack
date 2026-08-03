import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT ?? 3000);
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB_NAME ?? 'saas_crush';
const mongoCollectionName = process.env.MONGODB_COLLECTION_NAME ?? 'expo_leads';

const app = express();
app.use(express.json({ limit: '20kb' }));

// Keep the legacy browser favicon request working for browsers that do not
// honor the explicit SVG link in index.html.
app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.svg'));
});

let mongoClient: MongoClient | null = null;
// In-memory fallback for local development when MongoDB is unreachable.
let useInMemoryFallback = false;
const inMemoryRecords: any[] = [];

async function getLeadsCollection() {
  if (!mongoUri) {
    // If no URI configured, enable in-memory fallback for development.
    useInMemoryFallback = true;
    throw new Error('MONGODB_URI is not configured. Using in-memory fallback.');
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await mongoClient.connect();
  }

  return mongoClient.db(mongoDbName).collection(mongoCollectionName);
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

app.post('/api/leads', async (req, res) => {
  const fullName = cleanText(req.body?.fullName);
  const whatsappNumber = cleanText(req.body?.whatsappNumber);
  const email = cleanText(req.body?.email).toLowerCase();
  const sourceProductId = Number(req.body?.sourceProductId);
  const sourceProductName = cleanText(req.body?.sourceProductName);

  if (fullName.length < 2 || fullName.length > 80) {
    return res.status(400).json({ message: 'Please enter a valid full name.' });
  }

  if (!/^[+\d][\d\s().-]{7,19}$/.test(whatsappNumber)) {
    return res.status(400).json({ message: 'Please enter a valid WhatsApp number.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  try {
    try {
      const collection = await getLeadsCollection();
      const result = await collection.insertOne({
        fullName,
        whatsappNumber,
        email,
        score: 0,
        sourceProductId: Number.isFinite(sourceProductId) ? sourceProductId : null,
        sourceProductName,
        createdAt: new Date(),
        userAgent: req.get('user-agent') ?? '',
      });

      return res.status(201).json({ id: result.insertedId.toString(), fullName });
    } catch (err) {
      // Fallback to in-memory storage for development when MongoDB isn't reachable.
      useInMemoryFallback = true;
      const id = String(Date.now()) + '-' + Math.floor(Math.random() * 10000);
      inMemoryRecords.push({
        _id: id,
        fullName,
        whatsappNumber,
        email,
        score: 0,
        sourceProductId: Number.isFinite(sourceProductId) ? sourceProductId : null,
        sourceProductName,
        createdAt: new Date(),
        updatedAt: new Date(),
        userAgent: req.get('user-agent') ?? '',
      });

      return res.status(201).json({ id, fullName });
    }
  } catch (error) {
    console.error('Failed to save lead', error);
    return res.status(500).json({ message: 'Could not save your details. Please try again.' });
  }
});

app.get('/api/leaderboard', async (_req, res) => {
  try {
    try {
      const collection = await getLeadsCollection();
      const records = await collection
        .find(
          {
            fullName: { $type: 'string', $ne: '' },
            score: { $type: 'number', $gt: 0 },
          },
          {
            projection: {
              fullName: 1,
              score: 1,
              updatedAt: 1,
              createdAt: 1,
            },
          }
        )
        .sort({ score: -1, updatedAt: -1, createdAt: -1 })
        .limit(25)
        .toArray();

      return res.json({
        entries: records.map((record) => ({
          id: record._id.toString(),
          playerName: record.fullName,
          score: typeof record.score === 'number' ? record.score : 0,
        })),
      });
    } catch (err) {
      // Return leaderboard from in-memory records for local development.
      useInMemoryFallback = true;
      const sorted = inMemoryRecords
        .filter((r) => typeof r.fullName === 'string' && (typeof r.score === 'number' ? r.score > 0 : false))
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 25);

      return res.json({
        entries: sorted.map((record) => ({
          id: String(record._id),
          playerName: record.fullName,
          score: typeof record.score === 'number' ? record.score : 0,
        })),
      });
    }
  } catch (error) {
    console.error('Failed to load leaderboard', error);
    return res.status(500).json({ message: 'Could not load leaderboard.' });
  }
});

app.post('/api/scores', async (req, res) => {
  const leadId = cleanText(req.body?.leadId);
  const playerName = cleanText(req.body?.playerName);
  const score = Number(req.body?.score);
  const maxCombo = Number(req.body?.maxCombo);
  const totalMatches = Number(req.body?.totalMatches);
  const mode = cleanText(req.body?.mode);

  if (!playerName || playerName.length > 80) {
    return res.status(400).json({ message: 'Please enter a valid player name.' });
  }

  if (!Number.isFinite(score) || score <= 0) {
    return res.status(400).json({ message: 'Please enter a valid score.' });
  }

  try {
    try {
      const collection = await getLeadsCollection();
      const scoreFields = {
        fullName: playerName,
        score,
        maxCombo: Number.isFinite(maxCombo) ? maxCombo : 0,
        totalMatches: Number.isFinite(totalMatches) ? totalMatches : 0,
        mode,
        updatedAt: new Date(),
      };

      if (ObjectId.isValid(leadId)) {
        const result = await collection.updateOne(
          { _id: new ObjectId(leadId) },
          { $set: scoreFields }
        );

        if (result.matchedCount > 0) {
          return res.json({ id: leadId });
        }
      }

      const result = await collection.insertOne({
        ...scoreFields,
        whatsappNumber: '',
        email: '',
        createdAt: new Date(),
        userAgent: req.get('user-agent') ?? '',
      });

      return res.status(201).json({ id: result.insertedId.toString() });
    } catch (err) {
      // Fallback to in-memory save for development.
      useInMemoryFallback = true;
      const id = String(Date.now()) + '-' + Math.floor(Math.random() * 10000);
      inMemoryRecords.push({
        _id: id,
        fullName: playerName,
        score,
        maxCombo: Number.isFinite(maxCombo) ? maxCombo : 0,
        totalMatches: Number.isFinite(totalMatches) ? totalMatches : 0,
        mode,
        createdAt: new Date(),
        updatedAt: new Date(),
        whatsappNumber: '',
        email: '',
        userAgent: req.get('user-agent') ?? '',
      });

      return res.status(201).json({ id });
    }
  } catch (error) {
    console.error('Failed to save score', error);
    return res.status(500).json({ message: 'Could not save score.' });
  }
});

if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      hmr: false,
      middlewareMode: true,
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`SaaS Crush running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await mongoClient?.close();
  process.exit(0);
});
