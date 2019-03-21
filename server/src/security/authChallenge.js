const crypto = require("crypto");

// base64 encodes the given string
function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// creates a SHA-256 hash of the initialization vector
function sha256(buffer) {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest();
}

export { sha256, base64URLEncode };
