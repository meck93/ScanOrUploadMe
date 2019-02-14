import express from "express";
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

import jsonEvent from "../fakeData/mockEvent";

// define destination and how the filename for each uploaded file is created
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // extract the file extension
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );

    // create the filename
    const filename = file.fieldname + "-" + Date.now() + `.${fileExtension}`;

    // callback with filename
    cb(null, filename);
  }
});

// creates a disk storage object for local file storage
const upload = multer({ storage: storage });

router.post("/", upload.single("photo"), (req, res, next) => {
  if (!req.file) {
    return res.json({
      calendarEvent: null,
      msg: "File upload failed!",
      success: false
    });
  } else {
    // read the file
    fs.readFile(req.file.path, (err, data) => {
      // Define a JSONobject for the image attributes for saving to database
      const finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(data.toString("base64"), "base64")
      };

      // log the endpoint to which the request was sent to
      console.log(`Current Endpoint: ${req.headers.host}`);

      // create imgUrl with which the img can be viewed
      const imgUrl = `http://${
        req.headers.host
      }/uploads/${req.file.path.substring(
        req.file.path.lastIndexOf("\\") + 1
      )}`;

      // TODO: Implement sending the received picture to Google Cloud
      // 1. Implement API call to GoogleCloud in separate file
      // 2. Call API from here
      // 3. Process the result
      // 4. Send calendarEvent (like the fake one created below) to the client

      // dummy calendar event
      const calendarEvent = {
        id: jsonEvent.id,
        status: jsonEvent.status,
        created: jsonEvent.created,
        updated: jsonEvent.updated,
        summary: jsonEvent.summary,
        description: jsonEvent.description,
        location: jsonEvent.location,
        start: jsonEvent.start,
        end: jsonEvent.end,
        iCalUID: jsonEvent.iCalUID,
        sequence: jsonEvent.sequence,
        reminders: jsonEvent.reminders
      };

      // set the response object
      res.contentType("image/jpeg");

      // send success message plus link to picture
      res.json({
        location: imgUrl,
        calendarEvent: calendarEvent,
        msg: "File uploaded successfully!",
        success: true
      });
    });
  }
});

export default router;
