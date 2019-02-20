import express from "express";
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

import { getEntitiesFromText } from "../services/gcnlp";
import { getTextFromImage } from "../services/gcvocr";

import jsonEvent from "../fakeData/mockEvent";

// define destination and how the filename for each uploaded file is created
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // extract the file extension
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );

    const date = new Date(Date.now());
    const timestamp = `${date.getDate()}-${date.getMonth() +
      1}-19_${date.getHours()}-${date.getMinutes()}`;

    // create the filename
    const filename = file.fieldname + "-" + timestamp + `.${fileExtension}`;

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
      let calendarEvent;

      // set the response object
      res.contentType("image/jpeg");

      // create imgUrl with which the img can be viewed
      const imgUrl = `https://${
        process.env.PUBLIC_DEV_URL
      }/uploads/${req.file.path.substring(
        req.file.path.lastIndexOf("\\") + 1
      )}`;

      // log the endpoint to which the request was sent to
      console.log(
        `Current Endpoint: ${req.headers.host}. Current public URL: ${imgUrl}`
      );

      // TODO: Implement sending the received picture to Google Cloud
      // 1. Implement API call to GoogleCloud in separate file
      // 2. Call API from here
      let docText;
      let entities;

      getTextFromImage(imgUrl, "en")
        .then(result => {
          if (typeof result === "undefined") {
            console.log("No result from GC Vision!");
            return res.json({
              calendarEvent: null,
              msg: "Failed! No result from GC Vision!",
              success: false
            });
          } else if (typeof result.error !== "undefined") {
            console.log(
              "No feedback from Google Cloud or Google Cloud was not able to access image!"
            );
            return res.json({
              calendarEvent: null,
              msg: "Failed! GC Vision result contains error!",
              success: false
            });
          } else {
            // do something with the text
            docText = result;
            console.log("GC-VISION-RESULT:", JSON.stringify(docText));

            getEntitiesFromText(docText.description)
              .then(result => {
                if (typeof result === "undefined") {
                  console.log("No result from GC NLP!");
                  return res.json({
                    calendarEvent: null,
                    msg: "Failed! No result from GC NLP!",
                    success: false
                  });
                } else if (typeof result.error !== "undefined") {
                  console.log(
                    "No feedback from Google Cloud NLP. Request maybe invalid or not processed correctly."
                  );
                  return res.json({
                    calendarEvent: null,
                    msg: "Failed! GC NLP result contains error!",
                    success: false
                  });
                } else {
                  entities = result;
                  console.log("GC-NLP-ENTITIES:", JSON.stringify(entities));

                  // 3. Process the result
                  let entitiesText;
                  entities.forEach(entity => {
                    entitiesText += `${entity.name}-${entity.type}__`;
                  });

                  // 4. Send calendarEvent (like the fake one created below) to the client

                  // dummy calendar event
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

                  // send success message plus link to picture
                  return res.json({
                    location: imgUrl,
                    calendarEvent: calendarEvent,
                    msg: "File upload successfull!",
                    success: true
                  });
                }
              })
              .catch(err => {
                console.error("GC-NLP-ERROR:", err);
                return res.json({
                  calendarEvent: null,
                  msg: "Request to GC NLP failed!",
                  success: false
                });
              });
          }
        })
        .catch(err => {
          console.error("GC-VISION-ERROR:", err);
          return res.json({
            calendarEvent: null,
            msg: "Request to GC Vision failed!",
            success: false
          });
        });
    });
  }
});

export default router;
