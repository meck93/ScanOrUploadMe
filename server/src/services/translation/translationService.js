const { Translate } = require("@google-cloud/translate");
const regeneratorRuntime = require("regenerator-runtime");
const delay = require("delay");

// receives target language and translates text to english
async function translateText(textToTranslate) {
  // instantiate a client
  const translate = new Translate({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

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
        console.error("ERROR - TRANSLATION-SERVICE:", err);
        reject(error);
      });
  });
}

export { translateText };
