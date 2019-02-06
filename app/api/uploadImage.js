async function uploadImageAsync(uri) {
  let apiUrl = "https://file-upload-example-backend-dkhqoilqqn.now.sh/upload";
  let uriParts = uri.split(".");
  let fileType = uri[uri.length - 1];

  let formData = new FormData();

  formData.append("photo", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
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
