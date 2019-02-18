// Imports the Google Cloud client library
import { LanguageServiceClient } from "@google-cloud/language";

async function analyzeText(text) {
  // Creates a client
  const client = new LanguageServiceClient({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: "PLAIN_TEXT"
  };

  // Detects entities in the document
  client.analyzeEntities({ document }).then(response => {
    response[0].entities.forEach(entity => {
      // prints each detected entity including type and confidence
      console.log(
        `${entity.name} - Type: ${entity.type}, Salience: ${entity.salience}`
      );
    });
  });
}

export { analyzeText };
