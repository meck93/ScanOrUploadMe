import { createCipheriv, createDecipheriv } from 'crypto';

require('dotenv').load();

const algorithm = process.env.ENCRYPTION_ALGORITHM;
const key = process.env.ENCRYPTION_KEY;
const iv = process.env.ENCRYPTION_IV;
const inputEncoding = process.env.ENCRYPTION_IE;
const outputEncoding = process.env.ENCRYPTION_OE;

function encrypt(inputText) {
  if (inputText === undefined) {
    throw new Error('Undefined input');
  }

  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(inputText, inputEncoding, outputEncoding);
  encrypted += cipher.final(outputEncoding);
  return encrypted;
}

function decrypt(inputText) {
  if (inputText === undefined) {
    throw new Error('Undefined input');
  }

  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(inputText, outputEncoding, inputEncoding);
  decrypted += decipher.final(inputEncoding);
  return decrypted;
}

export { encrypt, decrypt };
