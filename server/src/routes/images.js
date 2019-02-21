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
    const imageUrl = `https://${
      process.env.PUBLIC_DEV_URL
    }/uploads/${req.file.path.substring(req.file.path.lastIndexOf("\\") + 1)}`;

    // log the endpoint to which the request was sent to
    console.log(
      `Current Endpoint: ${
        req.headers.host
      }.\nPublic URL to current Image: ${imageUrl}`
    );

    // TODO: Implement sending the received picture to Google Cloud
    // 1. Implement API call to GoogleCloud in separate file
    // 2. Call API from here
    let docText;
    let entities;

    // TODO: fix this!
    // we need to wait to make sure the image is ready
    wait(1500);

    getTextFromImage(imageUrl, "en")
      .then(result => {
        if (typeof result === "undefined") {
          throw new Error("Failed! No result from GC Vision!");
        } else if (typeof result.error !== "undefined") {
          console.log(result.error);
          throw new Error(
            "GC Vision was unable to access the image URL or no feedback!"
          );
        } else {
          // do something with the text
          docText = result;
          console.log("GC-VISION-RESULT:", JSON.stringify(docText));

          getEntitiesFromText(docText.description)
            .then(result => {
              if (typeof result === "undefined") {
                throw new Error("Failed! No result from GC NLP!");
              } else if (typeof result.error !== "undefined") {
                console.log(result.error);
                throw new Error("Failed! GC NLP result contains error!");
              } else {
                entities = result;
                console.log("GC-NLP-ENTITIES:", JSON.stringify(entities));

                // 3. Process the result
                let entitiesText;
                entities.forEach(entity => {
                  entitiesText += `${entity.name}-${entity.type}__`;
                });

                // 4. Send calendarEvent (like the fake one created below) to the client
                // dummy calendar event with some real data
                calendarEvent = {
                  description: docText.description,
                  summary: entitiesText,
                  location: "",
                  startTime: Date(),
                  endTime: Date(),
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
            })
            .catch(err => {
              // log error
              console.error("GC-NLP-ERROR:", err);

              // send failure response
              return res.json({
                calendarEvent: null,
                msg: err.message,
                uploaded: true,
                success: false
              });
            });
        }
      })
      .catch(err => {
        // log error
        console.error("GC-VISION-ERROR:", err);

        // send failure response
        return res.json({
          calendarEvent: null,
          msg: err.message,
          uploaded: true,
          success: false
        });
      });
  }
});

export default router;
