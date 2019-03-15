import express from "express";
const router = express.Router();

import { getEntitiesFromText } from "../services/nlp/entityRecognitionService";
import { getTextFromImageBase64 } from "../services/vision/OCRService";
import { createCalendarEvent } from "../services/calendar/calendarService";
import { translateFunc } from "../services/translation/translate_text";

router.post("/", (req, res) => {
  // log the endpoint to which the request was sent to
  console.log(`Current Endpoint: ${req.headers.host}.`);

  if (!req.body || req.body.base64 === null) {
    // if no body is contained in the request send a upload failure response
    return res.json({
      calendarEvent: null,
      msg: "File upload failed!",
      uploaded: false,
      success: false
    });
  } else {
    // IMAGE has successfully been received
    getTextFromImageBase64(req.body.base64, "en")
      .then(ocrResult => {
        if (typeof ocrResult === "undefined") {
          throw new Error("Failed! No result from GC Vision!");
        } else if (typeof ocrResult.error !== "undefined") {
          console.log(ocrResult.error);
          throw new Error(
            "GC Vision was unable to access the image URL or no feedback!"
          );
        } else {
          console.log("GC-VISION-RESULT:", JSON.stringify(ocrResult));

          let description_after_ocr;
          const language_before_translation = ocrResult.locale;

          if(language_before_translation === "sv"){
            description_after_ocr = translateFunc(ocrResult.description);
          }else{
            description_after_ocr = ocrResult.description;
          }

          getEntitiesFromText(description_after_ocr)
            .then(nlpResult => {
              if (typeof nlpResult === "undefined") {
                throw new Error("Failed! No result from GC NLP!");
              } else if (typeof nlpResult.error !== "undefined") {
                console.log(nlpResult.error);
                throw new Error("Failed! GC NLP result contains error!");
              } else {
                console.log("GC-NLP-ENTITIES:", JSON.stringify(nlpResult));

                // create the calendarEvent
                const calendarEvent = createCalendarEvent(nlpResult, description_after_ocr);
                console.log(calendarEvent);

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
