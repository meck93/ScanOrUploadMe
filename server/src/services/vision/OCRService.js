// Imports the Google Cloud client library
const vision = require("@google-cloud/vision").v1p1beta1;
require('dotenv').load();
const regeneratorRuntime = require("regenerator-runtime");

// Creates a client
function createOcrClient() {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });
  return client;
}

// google cloud vision ocr
async function getTextFromImage(pathToImage,client){
  // create request
  const request = {
    image: {
      source: { imageUri: pathToImage }
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
          if (response.textAnnotations.length === 0) {
            reject(
              new Error(
                "No text detected in the uploaded image. Please make sure that the image you upload contains text."
              )
            );
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
        }
      })
      .catch(err => {
        // request was unsuccessfull
        console.error("ERROR - OCR-SERVICE:", err);
        reject(err);
      });
  });
}

// google cloud vision ocr
async function getTextFromImageBase64(data, client){
  const request = {
    image: {
      content: data
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
          if (response.textAnnotations.length === 0) {
            reject(
              new Error(
                "No text detected in the uploaded image. Please make sure that the image you upload contains text."
              )
            );
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
        }
      })
      .catch(err => {
        // request was unsuccessful
        console.error("ERROR - OCR-SERVICE:", err);
        reject(err);
      });
  });
}

/*
const path = 'https://storage.googleapis.com/test_images_vision/image.png';
const client = createOcrClient();
getTextFromImage(path,client).then(function(result){
  //console.log(result);
});*/

export { getTextFromImage, getTextFromImageBase64, createOcrClient};
