const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// import routes
import images from './routes/images';
import home from './routes/home';

// load polyfill to make it work on old browsers
import '@babel/polyfill';

// load node environment variables
require('dotenv').config();

// basic configuration
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// create express app
const app = express();

// Add helmet security features
app.use(helmet());

// Add cross-origin resource sharing
app.use(cors());

// Add session middleware layer
const sesh = {
  name: 'SESS_ID',
  secret: process.env.SECURITY_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1800000 // 30 mins
  }
};

// ensure cookies are secure when used in production
if (app.get('env') === 'production') {
  // serve secure cookies
  sesh.cookie.secure = true;
}

// make the content of the directory /uploads static and available via the link /uploads
app.use('/uploads', express.static('uploads'));

// for parsing application/json
app.use(bodyParser.json({ limit: '10mb', extended: true }));

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// enable different routes
app.use('/images', images);
app.use('/', home);

// handle authentication errors
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(403).send({
      msg: 'No API access token was provided in the request. Please authenticate first!',
      uploaded: true,
      success: false
    });
  }
});

// limit the number of request to the /images API
// only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// app.enable("trust proxy");

// limit the number of API request to 100 per 15 minutes per IP address
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// only apply to requests that begin with /images/
app.use('/images/', apiLimiter);

// run the server
app.listen(port, () => {
  console.log(`Running stuff on http://${hostname}:${port}. NODE_ENV: ${process.env.NODE_ENV}.`);
});

module.exports = app; // testing
