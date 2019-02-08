import express from "express";
const router = express.Router();

// define the app's default route
router.get("/", (req, res) => {
  res.status(200).send("Welcome to our restful API");
});

// define a test route
router.get("/test", (req, res) => {
  res.status(200).send("I'm a test!");
});

export default router;
