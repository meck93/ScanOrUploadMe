import express from "express";
const router = express.Router();

import jwtCheck from "../security/jwtCheck";

import { getEntitiesFromText, createClient } from "../services/nlp/entityRecognitionService";
import { getTextFromImageBase64 } from "../services/vision/OCRService";
import { createCalendarEvent } from "../services/calendar/calendarService";
import { translateText } from "../services/translation/translationService";

router.post("/", jwtCheck, async (req, res) => {
    if (!req.body || req.body.base64 === null) {
        // if no body is contained in the request send a upload failure response
        return res.json({
            calendarEvent: null,
            msg: "File upload failed!",
            uploaded: false,
            success: false
        });
    } else {
        try {
            const ocrResult = await getTextFromImageBase64(req.body.base64);

            if (typeof ocrResult === "undefined") {
                throw new Error("Failed! No result from GC Vision!");
            } else if (typeof ocrResult.error !== "undefined") {
                throw new Error("GC Vision was unable to access the image URL or no feedback!");
            }

            console.log("GC-VISION-RESULT:", JSON.stringify(ocrResult));

            // extract OCR text language
            const langBeforeTranslation = ocrResult.locale.toUpperCase();

            // extract OCR text
            const ocrText = ocrResult.description;

            let translatedText;

            // translate OCR text to English to perfom entity recoginition
            if (langBeforeTranslation !== "EN") {
                const translationResult = await translateText(ocrText);

                if (typeof translationResult === "undefined") {
                    throw new Error("Failed! No result from GC Translation!");
                }
                console.log("GC-TRANSLATION:", JSON.stringify(translationResult));
                translatedText = translationResult;
            } else {
                // no translation is necessary since the image contained english text
                translatedText = ocrText;
            }

            // create google object needed by nlp
            const gClient = createClient();

            // perform entity recognition on english text
            const nlpResult = await getEntitiesFromText(translatedText, gClient);

            if (typeof nlpResult === "undefined") {
                throw new Error("Failed! No result from GC NLP!");
            } else if (typeof nlpResult.error !== "undefined") {
                throw new Error("Failed! GC NLP result contains error!");
            }
            console.log("GC-NLP-ENTITIES:", JSON.stringify(nlpResult));

            // create the calendarEvent
            const calendarEvent = createCalendarEvent(nlpResult, ocrText);
            console.log(calendarEvent);

            // send success response
            return res.json({
                location: req.body.uri,
                calendarEvent: calendarEvent,
                msg: "Success! Upload and GC processing worked!",
                uploaded: true,
                success: true
            });
        } catch (error) {
            console.log("GC-ERROR:", error);
            // send failure response
            return res.json({
                calendarEvent: null,
                msg: error.message,
                uploaded: true,
                success: false
            });
        }
    }
});

export default router;
