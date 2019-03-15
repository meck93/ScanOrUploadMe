/*import {getTextFromImage, getTextFromImageBase64} from "../src/services/vision/OCRService";
require('dotenv').config();
const regeneratorRuntime = require("regenerator-runtime");
const fs = require('fs');
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should;
chai.use(require('chai-string'));
chai.use(require('chai-as-promised'));
chai.should();


//const imageFile = fs.readFileSync('../src/fakeData/testUpload.png');
const path = 'https://storage.googleapis.com/test_images_vision/image.png';
const path2 = 'https://storage.googleapis.com/test_images_vision/pikachu.png';
const lang = 'en';
const testObj = { locations: [],description: 'hello world\n',locale: 'en', confidence: 0 }

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}



describe('OCRService using uri with correct input', function(){
  let result;
  before(async () => {
    //unfortunately
    //this.timeout('10sec');
    result = await getTextFromImage(path,lang);
  });
  it('should return an object after calling vision api', async(done) =>{
    expect(result).to.deep.equal(testObj);
    done();
  });
});

describe('OCRService using uri with incorrect input', function(){
  it(`should throw a type error`, async (done) => {
    expect(getTextFromImage(path2,lang)).to.be.rejectedWith(Error);
    done();
  });
});

const base64str = base64_encode('src/fakeData/testUpload.png');
const base64str_2 = base64_encode('src/fakeData/free_image_test_upload.jpg');
const testObj_2 = { locations: [],description: 'Dear LeBron, it is me, Skip\nBayless. I just wanted to tell you\nthat i am sorry.\nWe should have a meeting on\nFriday, starting 15.55 to 16.35.\nYours Truly.\n',locale: 'en', confidence: 0 }

describe('OCRService using base64 with correct input', function(){
  let results;
  before(async () => {
    results = await getTextFromImageBase64(base64str,lang);
  });
  it('should return an object after calling vision api', async(done) =>{
    expect(results).to.deep.equal(testObj_2);
    done();
  });
});

describe('OCRService using base64 using incorrect input', function(){
  it(`should throw a type error`, async (done) => {
    expect(getTextFromImageBase64(base64str_2,lang)).to.be.rejectedWith(Error);
    done();
  });
});

*/
