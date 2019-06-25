import express from "express";
const router = express.Router();

import jwtCheck from "../security/jwtCheck";

// middleware that is specific to this router
// attaches the current date to each request
router.use((req, res, next) => {
    req.requestTime = Date.now();
    next();
});

// define the app's default route + return a message
router.get("/", (req, res) => {
    res.status(200).json({
        message: `Welcome to the ScanOrUploadMe REST API.<br> You have requested this resouce at: ${req.requestTime}`
    });
});

// defines a test route which returns the current time
router.get("/test", jwtCheck, (req, res) => {
    res.status(200).json({ message: `You are authenticated: ${req.requestTime}` });
});

export default router;
