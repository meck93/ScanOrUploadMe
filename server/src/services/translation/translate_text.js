require('dotenv').config();
const {Translate} = require('@google-cloud/translate');
const regeneratorRuntime = require("regenerator-runtime");
const delay = require('delay');
// receives target language and translates text to english
async function translateFunc(ocrOutput){
  // instantiate a client
  const translate = new Translate({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });
  // translate target lang = english
  const target = 'en';
  // text to translate
  const text = ocrOutput;

  return new Promise((resolve, reject) => {
    // translate
    translate
      .translate(text, target)
      .then(results => {
        const translatedText = results[0];
        resolve(translatedText)

        if (translatedText.error){
          resolve(translatedText);
        } else {
          const translatedText_1 = results[0];
          resolve(translatedText_1);
          }
        })
        .catch(err=>{
          //console.log("ERROR", err);
          reject(err);
        });
  });
}
export { translateFunc };

/*
const test = "Hey du är bäst";
translateFunc(test).then(function(result){
  console.log(result);
});*/