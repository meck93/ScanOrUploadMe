const crypto = require("crypto");

const password = process.env.ENCRYPTION_KEY_PASSWORD;
const algorithm = process.env.ENCRYPTION_KEY_ALGORITHM;
const inputEncoding = process.env.ENCRYPTION_IE;
const outputEncoding = process.env.ENCRYPTION_OE;

function encrypt(inputText) {
  const cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(inputText, inputEncoding, outputEncoding);
  encrypted += cipher.final(outputEncoding);
  return encrypted;
}

function decrypt(inputText) {
  const decipher = crypto.createDecipher(algorithm, password);
  let decrypted = decipher.update(inputText, outputEncoding, inputEncoding);
  decrypted += decipher.final(inputEncoding);
  return decrypted;
}

export { encrypt, decrypt };
