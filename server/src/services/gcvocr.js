// google cloud vision ocr
async function getTextFromVision(pathtoimage){
  // import google cloud vision libraries
  const gcv = require('@google-cloud/vision');

  // create a client and authenticate
  const client = new gcv.ImageAnnotatorClient({
    // json key we need to hide
    keyFilename: process.env.PATH_TO_CREDENTIALS
  });

  // textDetection on the image
  const [result] = await client.textDetection(pathtoimage);
  // results
  const detections = result.textAnnotations;
  // return the results
  return detections[0];
};
