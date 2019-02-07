const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");

// import routes
import router from "./routes/routes";

// load polyfill to make it work on old browsers
import "@babel/polyfill";

// load node environment variables
require("dotenv").config();

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const app = express();

// Add cross-origin resource sharing
app.use(cors());

// encode url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable different routes
router(app);

var server = app.listen(port, function() {
  console.log(
    `Running stuff on http://${hostname}:${port}. NODE_ENV: ${
      process.env.NODE_ENV
    }.`
  );
});
