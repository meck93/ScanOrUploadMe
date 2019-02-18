// import google cloud vision libraries
const gcv = require("@google-cloud/vision");

// google cloud vision ocr
async function getTextFromVision(pathToImage) {
  // create a client and authenticate
  const client = new gcv.ImageAnnotatorClient({
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

  // Performs label detection on the image file
  client
    .textDetection(pathToImage)
    .then(response => {
      // print text detection result
      console.log(response[0].textAnnotations[0]);
      const text = response[0].textAnnotations[0].description;
      console.log(text);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}

export { getTextFromVision };
