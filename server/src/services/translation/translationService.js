const { Translate } = require("@google-cloud/translate");
require('dotenv').load();
const regeneratorRuntime = require("regenerator-runtime");
const delay = require("delay");

// Initiate translation (client)
function createTranslateClient() {
  const translate = new Translate({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });
  return translate;
}

// receives target language and translates text to english
async function translateText(textToTranslate, translate) {
  // translate target lang = english
  const targetLanguage = "EN";

  return new Promise((resolve, reject) => {
    // translate the text
    translate
      .translate(textToTranslate, targetLanguage)
      .then(result => {
        // extract the translated text
        const translatedText = result[0];
        resolve(translatedText);
      })
      .catch(error => {
        // request was unsuccessfull
        console.error("ERROR - TRANSLATION-SERVICE:", error);
        reject(error);
      });
  });
}

export { translateText, createTranslateClient };
