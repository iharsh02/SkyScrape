import crypto from "crypto";

const ALG = "aes-256-cbc";

export const symetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("key is not found");

  const iv = crypto.randomBytes(16);
  
  const buffer_key = Buffer.from(key, "hex");
  if (buffer_key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (256 bits)");
  }

  const cipher = crypto.createCipheriv(ALG, buffer_key, iv);
  
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("key not found");

  const textParts = encrypted.split(":");
  if (textParts.length !== 2) throw new Error("Invalid encrypted text format");

  const iv = Buffer.from(textParts[0], "hex");
  const encryptedText = Buffer.from(textParts[1], "hex");
  
  const buffer_key = Buffer.from(key, "hex");
  if (buffer_key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (256 bits)");
  }

  const decipher = crypto.createDecipheriv(ALG, buffer_key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
