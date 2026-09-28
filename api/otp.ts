import {
  createHash,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';

export const OTP_LENGTH = 6;

// Your WhatsApp template says 10 minutes.
export const OTP_EXPIRY_SECONDS = 10 * 60;

export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;

export type OtpChallengeRecord = {
  _id: string;
  phone: string;
  codeHash: string;
  attempts: number;
  createdAt: Date;
  expiresAt: Date;
  consumedAt: Date | null;
};

export interface OtpStore {
  insert(challenge: OtpChallengeRecord): Promise<void>;
  findById(id: string): Promise<OtpChallengeRecord | null>;
  findLatestByPhone(phone: string): Promise<OtpChallengeRecord | null>;
  incrementAttempts(id: string, lock: boolean): Promise<void>;
  consume(id: string): Promise<boolean>;
}

export class OtpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'OtpError';
    this.status = status;
  }
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Accept Indian 10-digit mobile number.
 *
 * Example:
 * 9876543210
 *
 * WhatsApp API recipient becomes:
 * 919876543210
 */
export function validateWhatsAppNumber(value: unknown) {
  const phone = cleanText(value).replace(/\s+/g, '');

  if (!/^\d{10}$/.test(phone)) {
    throw new OtpError(
      'Please enter a valid 10-digit WhatsApp number.'
    );
  }

  return phone;
}

function hashOtp(challengeId: string, code: string) {
  const configuredSecret = process.env.OTP_HASH_SECRET?.trim();

  if (
    !configuredSecret &&
    process.env.NODE_ENV === 'production'
  ) {
    throw new OtpError(
      'WhatsApp OTP is not configured on this server.',
      503
    );
  }

  const secret =
    configuredSecret || 'local-development-only';

  return createHash('sha256')
    .update(`${secret}:${challengeId}:${code}`)
    .digest('hex');
}

function codesMatch(
  expectedHash: string,
  challengeId: string,
  code: string
) {
  const actualHash = hashOtp(
    challengeId,
    code
  );

  const expected = Buffer.from(
    expectedHash,
    'hex'
  );

  const actual = Buffer.from(
    actualHash,
    'hex'
  );

  return (
    expected.length === actual.length &&
    timingSafeEqual(expected, actual)
  );
}

function whatsappRecipient(phone: string) {
  const configuredCountryCode =
    process.env.WHATSAPP_COUNTRY_CODE || '91';
  const countryCode = configuredCountryCode.replace(/\D/g, '');

  if (!/^\d{1,3}$/.test(countryCode)) {
    throw new OtpError(
      'WhatsApp country code is not configured correctly. Use digits only, for example 91.',
      503
    );
  }

  return `${countryCode}${phone}`;
}

/**
 * Send OTP using Meta WhatsApp Cloud API.
 *
 * Template:
 * gowhats_otp
 *
 * Template type:
 * Authentication
 *
 * Template contains:
 * Body -> {{1}}
 * Copy Code button
 */
async function sendWhatsAppMessage(
  phone: string,
  code: string
) {
  const mode = (
    process.env.WHATSAPP_OTP_MODE ||
    'meta'
  )
    .trim()
    .toLowerCase();

  /**
   * Development mode.
   *
   * Instead of sending WhatsApp,
   * print OTP in terminal.
   */
  if (mode === 'console') {
    console.info(
      `[otp] Development WhatsApp code for +${whatsappRecipient(
        phone
      )}: ${code}`
    );

    return;
  }

  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN?.trim();

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  const templateName =
    process.env.WHATSAPP_OTP_TEMPLATE_NAME?.trim();

  const languageCode =
    process.env.WHATSAPP_OTP_LANGUAGE_CODE?.trim() ||
    'en';

  const graphApiVersion =
    process.env.WHATSAPP_GRAPH_API_VERSION?.trim() ||
    'v23.0';

  if (
    !accessToken ||
    !phoneNumberId ||
    !templateName
  ) {
    throw new OtpError(
      'WhatsApp OTP is not configured on this server.',
      503
    );
  }

  const recipient =
    whatsappRecipient(phone);

  const url =
    `https://graph.facebook.com/` +
    `${graphApiVersion}/` +
    `${phoneNumberId}/messages`;

  /**
   * Authentication template with:
   *
   * BODY:
   * {{1}}
   *
   * BUTTON:
   * Copy Code
   *
   * The same OTP is supplied to both
   * the body and authentication button.
   */
  const requestBody = {
    messaging_product: 'whatsapp',

    recipient_type: 'individual',

    to: recipient,

    type: 'template',

    template: {
      name: templateName,

      language: {
        code: languageCode,
      },

      components: [
        {
          type: 'body',

          parameters: [
            {
              type: 'text',
              text: code,
            },
          ],
        },

        {
          type: 'button',

          sub_type: 'url',

          index: '0',

          parameters: [
            {
              type: 'text',
              text: code,
            },
          ],
        },
      ],
    },
  };

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${accessToken}`,

        'Content-Type':
          'application/json',
      },

      body: JSON.stringify(
        requestBody
      ),
    });
  } catch (error) {
    console.error(
      '[whatsapp] Failed to reach Meta WhatsApp API',
      error
    );

    throw new OtpError(
      'Could not send the WhatsApp OTP. Please try again.',
      502
    );
  }

  const responseText =
    await response.text().catch(() => '');

  let providerResponse: unknown = null;

  try {
    providerResponse = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    providerResponse = responseText;
  }

  if (!response.ok) {
    console.error(
      '[whatsapp] Meta WhatsApp API rejected OTP request',
      {
        status: response.status,
        response: responseText.slice(0, 1000),
      }
    );

    throw new OtpError(
      'Could not send the WhatsApp OTP. Please try again.',
      502
    );
  }

  console.info(
    '[whatsapp] OTP sent successfully',
    {
      phone: recipient,
      messageId:
        typeof providerResponse === 'object' &&
        providerResponse !== null &&
        'messages' in providerResponse
          ? (
              providerResponse as {
                messages?: Array<{
                  id?: string;
                }>;
              }
            ).messages?.[0]?.id
          : undefined,
    }
  );
}

/**
 * Generate and send OTP.
 */
export async function sendOtp(
  phone: string,
  store: OtpStore
) {
  const normalizedPhone =
    validateWhatsAppNumber(phone);

  const latestChallenge =
    await store.findLatestByPhone(
      normalizedPhone
    );

  const cooldownEndsAt =
    latestChallenge
      ? latestChallenge.createdAt.getTime() +
        OTP_RESEND_COOLDOWN_SECONDS * 1000
      : 0;

  if (
    latestChallenge &&
    cooldownEndsAt > Date.now()
  ) {
    const retryAfterSeconds =
      Math.ceil(
        (cooldownEndsAt - Date.now()) /
          1000
      );

    throw new OtpError(
      `Please wait ${retryAfterSeconds} seconds before requesting another code.`,
      429
    );
  }

  const challengeId =
    randomUUID();

  const code = randomInt(
    10 ** (OTP_LENGTH - 1),
    10 ** OTP_LENGTH
  ).toString();

  const codeHash =
    hashOtp(
      challengeId,
      code
    );

  /**
   * Send WhatsApp first.
   *
   * Only save OTP if WhatsApp successfully
   * accepted the message.
   */
  await sendWhatsAppMessage(
    normalizedPhone,
    code
  );

  await store.insert({
    _id: challengeId,

    phone: normalizedPhone,

    codeHash,

    attempts: 0,

    createdAt: new Date(),

    expiresAt: new Date(
      Date.now() +
        OTP_EXPIRY_SECONDS * 1000
    ),

    consumedAt: null,
  });

  return {
    challengeId,

    expiresInSeconds:
      OTP_EXPIRY_SECONDS,

    retryAfterSeconds:
      OTP_RESEND_COOLDOWN_SECONDS,
  };
}

/**
 * Verify OTP.
 */
export async function verifyOtp(
  phone: string,
  challengeId: string,
  code: string,
  store: OtpStore
) {
  const normalizedPhone =
    validateWhatsAppNumber(phone);

  const normalizedChallengeId =
    cleanText(challengeId);

  const normalizedCode =
    cleanText(code);

  if (
    !normalizedChallengeId ||
    !/^\d{6}$/.test(
      normalizedCode
    )
  ) {
    throw new OtpError(
      'Please enter the 6-digit WhatsApp OTP.'
    );
  }

  const challenge =
    await store.findById(
      normalizedChallengeId
    );

  if (
    !challenge ||
    challenge.phone !==
      normalizedPhone ||
    challenge.consumedAt
  ) {
    throw new OtpError(
      'That WhatsApp OTP is no longer valid. Please request a new code.'
    );
  }

  if (
    challenge.expiresAt.getTime() <=
    Date.now()
  ) {
    throw new OtpError(
      'That WhatsApp OTP has expired. Please request a new code.'
    );
  }

  if (
    challenge.attempts >=
    OTP_MAX_ATTEMPTS
  ) {
    throw new OtpError(
      'Too many incorrect attempts. Please request a new code.',
      429
    );
  }

  const valid =
    codesMatch(
      challenge.codeHash,
      normalizedChallengeId,
      normalizedCode
    );

  if (!valid) {
    const newAttempts =
      challenge.attempts + 1;

    const lock =
      newAttempts >=
      OTP_MAX_ATTEMPTS;

    await store.incrementAttempts(
      normalizedChallengeId,
      lock
    );

    throw new OtpError(
      lock
        ? 'Too many incorrect attempts. Please request a new code.'
        : 'That WhatsApp OTP is incorrect.',
      lock ? 429 : 400
    );
  }

  /**
   * Consume OTP.
   *
   * This prevents the same OTP from
   * being reused.
   */
  const consumed =
    await store.consume(
      normalizedChallengeId
    );

  if (!consumed) {
    throw new OtpError(
      'That WhatsApp OTP is no longer valid. Please request a new code.'
    );
  }

  return {
    verified: true,
  };
}

/**
 * In-memory store.
 *
 * Useful for development only.
 */
export function createMemoryOtpStore(): OtpStore {
  const records =
    new Map<
      string,
      OtpChallengeRecord
    >();

  return {
    async insert(challenge) {
      records.set(
        challenge._id,
        challenge
      );
    },

    async findById(id) {
      return (
        records.get(id) || null
      );
    },

    async findLatestByPhone(
      phone
    ) {
      return (
        [
          ...records.values(),
        ]
          .filter(
            (record) =>
              record.phone === phone &&
              !record.consumedAt
          )
          .sort(
            (a, b) =>
              b.createdAt.getTime() -
              a.createdAt.getTime()
          )[0] || null
      );
    },

    async incrementAttempts(
      id,
      lock
    ) {
      const record =
        records.get(id);

      if (record) {
        record.attempts += 1;

        if (lock) {
          record.consumedAt =
            new Date();
        }
      }
    },

    async consume(id) {
      const record =
        records.get(id);

      if (
        !record ||
        record.consumedAt
      ) {
        return false;
      }

      record.consumedAt =
        new Date();

      return true;
    },
  };
}

/**
 * MongoDB store.
 *
 * Use this in production so OTP records
 * survive separate API requests.
 */
export function createMongoOtpStore(
  collection: any
): OtpStore {
  return {
    async insert(challenge) {
      await collection.insertOne(
        challenge
      );
    },

    async findById(id) {
      return (await collection.findOne({
        _id: id,
      })) as OtpChallengeRecord | null;
    },

    async findLatestByPhone(
      phone
    ) {
      return (await collection.findOne(
        {
          phone,
          consumedAt: null,
        },
        {
          sort: {
            createdAt: -1,
          },
        }
      )) as OtpChallengeRecord | null;
    },

    async incrementAttempts(
      id,
      lock
    ) {
      await collection.updateOne(
        {
          _id: id,
          consumedAt: null,
        },
        {
          $inc: {
            attempts: 1,
          },

          ...(lock
            ? {
                $set: {
                  consumedAt:
                    new Date(),
                },
              }
            : {}),
        }
      );
    },

    async consume(id) {
      const result =
        await collection.updateOne(
          {
            _id: id,
            consumedAt: null,
          },
          {
            $set: {
              consumedAt:
                new Date(),
            },
          }
        );

      return (
        result.matchedCount === 1
      );
    },
  };
}
