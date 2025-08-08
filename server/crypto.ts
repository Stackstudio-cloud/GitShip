import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12; // GCM recommended 12 bytes
const AUTH_TAG_LENGTH_BYTES = 16;

function getKey(): Buffer | null {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) return null;
  // Accept hex or base64; otherwise, derive from utf-8 passphrase
  try {
    if (/^[0-9a-fA-F]{64}$/.test(key)) {
      return Buffer.from(key, "hex");
    }
    const b64 = Buffer.from(key, "base64");
    if (b64.length === 32) return b64;
  } catch {}
  // Derive a 32-byte key from passphrase
  return crypto.createHash("sha256").update(key, "utf8").digest();
}

export function encryptText(plaintext: string): string {
  const key = getKey();
  if (!key) return plaintext;

  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH_BYTES });
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: enc:v1:<iv_b64>:<tag_b64>:<ct_b64>
  return [
    "enc:v1",
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(":");
}

export function isEncrypted(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("enc:v1:");
}

export function decryptText(value: string): string {
  const key = getKey();
  if (!key || !isEncrypted(value)) return value;

  const [, , ivB64, tagB64, ctB64] = value.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH_BYTES });
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  return plaintext;
}


