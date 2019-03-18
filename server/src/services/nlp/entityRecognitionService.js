// Imports the Google Cloud client library
import { LanguageServiceClient } from "@google-cloud/language";

async function getEntitiesFromText(text) {
  // Creates a client
  const client = new LanguageServiceClient({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: "PLAIN_TEXT",
    language: "en"
  };

  return new Promise((resolve, reject) => {
    // detects entities in the string
    client
      .analyzeEntities({ document })
      .then(response => {
        // if the request was successfull but contains an error object
        // resolve the error object and handle it further down
        if (response.error) {
          resolve(response);
        } else {
          // request was successfull and contains no error object
          let result = [];
          // extract the relevant information for each entity discovered
          response[0].entities.forEach(entity => {
            result.push({
              name: entity.name,
              type: entity.type,
              salience: entity.salience
            });
          });
          resolve(result);
        }
      })
      .catch(err => {
        // request was unsuccessfull
        console.error("ERROR - in NLP-Service:", err);
        reject(err);
      });
  });
}

export { getEntitiesFromText };
