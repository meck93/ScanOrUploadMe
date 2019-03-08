// Imports the Google Cloud client library
const vision = require("@google-cloud/vision").v1p1beta1;
const regeneratorRuntime = require("regenerator-runtime");
// google cloud vision ocr
async function getTextFromImage(pathToImage, lang) {
  // create a client and authenticate
  const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

  const request = {
    image: {
      source: { imageUri: pathToImage }
    },
    imageContext: {
      languageHints: [lang]
    }
  };

  return new Promise((resolve, reject) => {
    // detect the text in the image
    client
      .textDetection(request)
      .then(result => {
        const response = result[0];
        // if the request was successfull but contains an error object
        // resolve the error object and handle it further down
        if (response.error) {
          resolve(response);
          // request was successfull and contains no error object
        } else {
          // extract the relevant information to be returned
          const res = {
            locations: response.textAnnotations[0].locations,
            description: response.textAnnotations[0].description,
            locale: response.textAnnotations[0].locale,
            confidence: response.textAnnotations[0].confidence
          };
          resolve(res);
        }
      })
      .catch(err => {
        // request was unsuccessfull
        console.error("ERROR:", err);
        reject(err);
      });
  });
}

// google cloud vision ocr
async function getTextFromImageBase64(data, lang) {
  // create a client and authenticate
  const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

  const request = {
    image: {
      content: data
    },
    imageContext: {
      languageHints: [lang]
    }
  };

  return new Promise((resolve, reject) => {
    // detect the text in the image
    client
      .textDetection(request)
      .then(result => {
        const response = result[0];
        // if the request was successfull but contains an error object
        // resolve the error object and handle it further down
        if (response.error) {
          resolve(response);
          // request was successfull and contains no error object
        } else {
          // extract the relevant information to be returned
          const res = {
            locations: response.textAnnotations[0].locations,
            description: response.textAnnotations[0].description,
            locale: response.textAnnotations[0].locale,
            confidence: response.textAnnotations[0].confidence
          };
          resolve(res);
        }
      })
      .catch(err => {
        // request was unsuccessful
        console.error("ERROR:", err);
        reject(err);
      });
  });
}

export { getTextFromImage, getTextFromImageBase64 };
