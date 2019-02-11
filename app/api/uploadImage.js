import { Constants } from "expo";

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

  return fetch(apiUrl, options);
}

export { uploadImageAsync };
