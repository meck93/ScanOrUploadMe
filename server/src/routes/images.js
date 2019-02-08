import express from "express";
const router = express.Router();

// middleware that is specific to this router
// example: attaches the current date to each request below /images
router.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// define the /images default url
router.get("/", (req, res) => {
  res
    .status(200)
    .send(`This is the /images route requested at ${req.requestTime}`);
});

export default router;
