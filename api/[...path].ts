import dns from 'node:dns';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

type ApiRequest = {
  method?: string;
  url?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => ApiResponse;
};

type RequestBody = Record<string, unknown>;

const mongoUri = process.env.MONGODB_URI?.trim();
const mongoDbName = process.env.MONGODB_DB_NAME ?? 'saas_crush';
const mongoCollectionName = process.env.MONGODB_COLLECTION_NAME ?? 'expo_leads';

const configuredDnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(',')
  .map((server) => server.trim())
  .filter(Boolean);
const currentDnsServers = dns.getServers();
if (configuredDnsServers?.length) {
  dns.setServers(configuredDnsServers);
} else if (
  currentDnsServers.length > 0 &&
  currentDnsServers.every((server) => server === '127.0.0.1' || server === '::1')
) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

let mongoClientPromise: Promise<MongoClient> | undefined;

async function getLeadsCollection() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  if (!mongoClientPromise) {
    const client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    mongoClientPromise = client.connect().catch((error) => {
      mongoClientPromise = undefined;
      throw error;
    });
  }

  const client = await mongoClientPromise;
  return client.db(mongoDbName).collection(mongoCollectionName);
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function requestBody(req: ApiRequest): RequestBody {
  if (req.body && typeof req.body === 'object') {
    return req.body as RequestBody;
  }

  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  return {};
}

function databaseErrorMessage() {
  return mongoUri
    ? 'Database is temporarily unavailable. Please try again.'
    : 'Database is not configured for this deployment.';
}

function userAgent(req: ApiRequest) {
  const value = req.headers?.['user-agent'];
  return typeof value === 'string' ? value : '';
}

async function handleLead(req: ApiRequest, res: ApiResponse) {
  const body = requestBody(req);
  const fullName = cleanText(body.fullName);
  const whatsappNumber = cleanText(body.whatsappNumber);
  const email = cleanText(body.email).toLowerCase();
  const sourceProductId = Number(body.sourceProductId);
  const sourceProductName = cleanText(body.sourceProductName);

  if (fullName.length < 2 || fullName.length > 80) {
    return res.status(400).json({ message: 'Please enter a valid full name.' });
  }

  if (!/^\d{10}$/.test(whatsappNumber)) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit WhatsApp number.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

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
      userAgent: userAgent(req),
    });

    return res.status(201).json({ id: result.insertedId.toString(), fullName });
  } catch (error) {
    console.error('[database] Vercel lead save failed', error);
    return res.status(503).json({ message: databaseErrorMessage() });
  }
}

async function handleLeaderboard(res: ApiResponse) {
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
  } catch (error) {
    console.error('[database] Vercel leaderboard load failed', error);
    return res.status(503).json({ message: databaseErrorMessage() });
  }
}

async function handleScore(req: ApiRequest, res: ApiResponse) {
  const body = requestBody(req);
  const leadId = cleanText(body.leadId);
  const playerName = cleanText(body.playerName);
  const score = Number(body.score);
  const maxCombo = Number(body.maxCombo);
  const totalMatches = Number(body.totalMatches);
  const mode = cleanText(body.mode);

  if (!playerName || playerName.length > 80) {
    return res.status(400).json({ message: 'Please enter a valid player name.' });
  }

  if (!Number.isFinite(score) || score <= 0) {
    return res.status(400).json({ message: 'Please enter a valid score.' });
  }

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
      userAgent: userAgent(req),
    });

    return res.status(201).json({ id: result.insertedId.toString() });
  } catch (error) {
    console.error('[database] Vercel score save failed', error);
    return res.status(503).json({ message: databaseErrorMessage() });
  }
}

async function handleHealth(res: ApiResponse) {
  try {
    const collection = await getLeadsCollection();
    await collection.findOne({}, { projection: { _id: 1 } });
    return res.json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('[database] Vercel health check failed', error);
    return res.status(503).json({
      ok: false,
      database: mongoUri ? 'unavailable' : 'not_configured',
    });
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname.replace(/\/+$/, '');
  const method = (req.method ?? 'GET').toUpperCase();

  if (pathname === '/api/health' && method === 'GET') {
    return handleHealth(res);
  }

  if (pathname === '/api/leads' && method === 'POST') {
    return handleLead(req, res);
  }

  if (pathname === '/api/leaderboard' && method === 'GET') {
    return handleLeaderboard(res);
  }

  if (pathname === '/api/scores' && method === 'POST') {
    return handleScore(req, res);
  }

  return res.status(404).json({ message: 'API route not found.' });
}
