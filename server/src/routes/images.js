import express from "express";
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// define destination and how the filename for each uploaded file is created
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // extract the file extension
    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1
    );

    // create the filename
    const filename = file.fieldname + "-" + Date.now() + `.${fileExtension}`;

    // callback with filename
    cb(null, filename);
  }
});

// creates a disk storage object for local file storage
const upload = multer({ storage: storage });

// middleware that is specific to this router
// example: attaches the current date to each request below /images
router.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// define the /images default url
router.get("/", (req, res) => {
  res
    .status(200)
    .send(`This is the /images route requested at ${req.requestTime}`);
});

router.get("/:id", (req, res) => {});

router.post("/", upload.single("photo"), (req, res, next) => {
  if (!req.file) {
    return res.json({
      msg: "File upload failed!",
      success: false
    });
  } else {
    // read the file
    fs.readFile(req.file.path, (err, data) => {
      // Define a JSONobject for the image attributes for saving to database
      const finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(data.toString("base64"), "base64")
      };

      // log the endpoint to which the request was sent to
      console.log(req.headers.host);

      // create imgUrl with which the img can be viewed
      const imgUrl = `http://${
        req.headers.host
      }/uploads/${req.file.path.substring(
        req.file.path.lastIndexOf("\\") + 1
      )}`;

      // set the response object
      res.contentType("image/jpeg");

      // send success message plus link to picture
      res.json({
        location: imgUrl,
        msg: "File uploaded successfully!",
        success: true
      });
    });
  }
});

export default router;
