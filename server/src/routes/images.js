import express from "express";
const router = express.Router();
const multer = require("multer");

import { getEntitiesFromText } from "../services/gcnlp";
import { getTextFromImage } from "../services/gcvocr";

// define destination and how the filename for each uploaded file is created
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // extract the file extension
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );

    // create a unique ID (timestamp) from the current date and time
    const date = new Date(Date.now());
    const timestamp = `${date.getDate()}0${date.getMonth() +
      1}19_${date.getHours()}${date.getMinutes()}`;

    // create the filename
    const filename = file.fieldname + "-" + timestamp + `.${fileExtension}`;

    // callback with filename
    cb(null, filename);
  }
});

// creates a disk storage object for local file storage
const upload = multer({ storage: storage });

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

router.post("/", upload.single("photo"), (req, res) => {
  if (!req.file) {
    // if no file is contained in the request send a upload failure response
    return res.json({
      calendarEvent: null,
      msg: "File upload failed!",
      uploaded: false,
      success: false
    });
  } else {
    // file upload was sucessfull
    let calendarEvent;

    // set the response object
    res.contentType("image/jpeg");

    // create imageUrl with which the img can be viewed
    const imageUrl = `http://${
      req.headers.host
    }/uploads/${req.file.path.substring(req.file.path.lastIndexOf("\\") + 1)}`;

    // log the endpoint to which the request was sent to
    console.log(
      `Current Endpoint: ${
        req.headers.host
      }.\nPublic URL to current Image: ${imageUrl}`
    );

    // 4. Send calendarEvent (like the fake one created below) to the client
    // dummy calendar event with some real data
    let now = new Date();
    let start = new Date(now.setHours(now.getHours() + 1)).toString();
    let end = new Date(now.setHours(now.getHours() + 2)).toString();

    calendarEvent = {
      description: "Birthday Party",
      summary:
        "Hi John\nI would like to invite you to my birthday party!\nBest James",
      location: "Klostergatan, Uppsala, Sweden",
      startTime: start,
      endTime: end,
      reminders: {
        overrides: [{ method: "popup", minutes: 15 }],
        useDefault: false
      },
      updated: Date()
    };

    // send success response
    return res.json({
      location: imageUrl,
      calendarEvent: calendarEvent,
      msg: "Success! Upload and GC processing worked!",
      uploaded: true,
      success: true
    });
  }
});

export default router;
