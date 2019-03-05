import { Constants } from "expo";

function makeRequest(apiEndpoint, options) {
  const FETCH_TIMEOUT = 15000;
  let didTimeOut = false;

  // new fetch request including a timeout interval to cancel the request if the server cannot be reached
  return new Promise((resolve, reject) => {
    // creates timeout interval
    const timeout = setTimeout(() => {
      didTimeOut = true;
      reject(
        new Error(
          "The request has timed out. Unfortunately, the server cannot be reached. Check if you are connected to the Internet."
        )
      );
    }, FETCH_TIMEOUT);

    fetch(apiEndpoint, options)
      .then(response => {
        // Clear the timeout
        clearTimeout(timeout);

        // check if request timed out
        if (!didTimeOut) {
          // no timeout, request successfull
          resolve(response);
        }
      })
      .catch(error => {
        console.log("Fetch Failed!", error);

        // rejection already happend with setTimeout
        if (didTimeOut) {
          console.log("Request had already timed out");
          return;
        }

        // reject with error
        reject(error);
      });
  });
}

async function uploadImageAsync(uri) {
  // load default URL depending if development or productive
  let { manifest } = Constants;

  const api =
    typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
      ? manifest.debuggerHost
          .split(`:`)
          .shift()
          .concat(`:3000`)
      : `scanoruploadme.herokuapp.com`;

  // create target REST endpoint
  let apiUrl = `http://${api}/images`;

  // log URL to verify correct endpoint
  console.log(apiUrl);

  // extract the filetype
  let fileType = uri.substring(uri.lastIndexOf(".") + 1);

  let formData = new FormData();

  formData.append("photo", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
    fileExtension: fileType
  });

  let options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    }
  };

  return makeRequest(apiUrl, options);
}

async function uploadBase64(data) {
  // load default URL depending if development or productive
  let { manifest } = Constants;

  const api =
    typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
      ? manifest.debuggerHost
          .split(`:`)
          .shift()
          .concat(`:3000`)
      : `scanoruploadme.herokuapp.com`;

  // create target REST endpoint
  let apiUrl = `http://${api}/images`;

  // ensure that there are no line breaks inside the base64 encoded image string
  let base64image = data.base64.replace(/(?:\r\n|\r|\n)/g, "");
  data.base64 = base64image;

  // log URL to verify correct endpoint
  console.log(apiUrl);

  let options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  return makeRequest(apiUrl, options);
}

export { uploadImageAsync, uploadBase64 };
