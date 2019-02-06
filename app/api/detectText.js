import * as base from "../config/config";

async function detectText(imageUri) {
  let body = JSON.stringify({
    requests: [
      {
        features: [
          { type: "TEXT_DETECTION", maxResults: 10 },
          { type: "DOCUMENT_TEXT_DETECTION", maxResults: 10 }
        ],
        image: {
          source: {
            imageUri: imageUri
          }
        }
      }
    ]
  });

  let response = await fetch(
    // TODO: Add Google Cloud API key
    "https://vision.googleapis.com/v1/images:annotate?key=" + base.apiKey,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: body
    }
  );

  let responseJson = await response.json();
  console.log(responseJson);

  return responseJson;
}

export { detectText };
