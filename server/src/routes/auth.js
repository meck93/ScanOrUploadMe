import express from "express";
const router = express.Router();
const crypto = require("crypto");

import { sha256, base64URLEncode } from "../security/authChallenge";

router.get("/", (req, res) => {
  // generates cryptographically strong 32 bytes of pseudo-random data => IV (initialization vector)
  const verifier = base64URLEncode(crypto.randomBytes(32));

  // produce a SHA-256 hash of the IV => code_challenge
  const challenge = base64URLEncode(sha256(verifier));

  // return the result to the requester
  res.send({
    verifier: verifier,
    code_challenge: challenge,
    code_challenge_method: "S256"
  });
});

export default router;
