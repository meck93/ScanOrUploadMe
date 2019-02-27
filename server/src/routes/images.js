import express from "express";
const router = express.Router();
const fs = require("fs");

import { getEntitiesFromText } from "../services/gcnlp";
import { getTextFromImageBase64 } from "../services/gcvocr";

router.post("/test", (req, res) => {
  if (!req.body || req.body.base64 === null) {
    // if no body is contained in the request send a upload failure response
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

    // log the endpoint to which the request was sent to
    console.log(`Current Endpoint: ${req.headers.host}.`);

    // write base64 to image
    fs.writeFileSync("./uploads/image.png", req.body.base64, {
      encoding: "base64"
    });

    // read image
    const imageFile = fs.readFileSync("./uploads/image.png");

    // Convert the image data to a Buffer and base64 encode it.
    const encoded = Buffer.from(imageFile).toString("base64");

    getTextFromImageBase64(encoded, "en")
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
          let docText = result;
          console.log("GC-VISION-RESULT:", JSON.stringify(docText));

          getEntitiesFromText(docText.description)
            .then(result => {
              if (typeof result === "undefined") {
                throw new Error("Failed! No result from GC NLP!");
              } else if (typeof result.error !== "undefined") {
                console.log(result.error);
                throw new Error("Failed! GC NLP result contains error!");
              } else {
                let entities = result;
                console.log("GC-NLP-ENTITIES:", JSON.stringify(entities));

                // 3. Process the result
                let entitiesText;
                entities.forEach(entity => {
                  entitiesText += `${entity.name}-${entity.type}__`;
                });

                // 4. Send calendarEvent (like the fake one created below) to the client
                // dummy calendar event with some real data
                calendarEvent = {
                  id: Math.random() * 100000,
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
                  location: req.body.uri,
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
