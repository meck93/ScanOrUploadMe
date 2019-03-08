import {getTextFromImage, getTextFromImageBase64} from "../src/services/vision/OCRService";
//const regeneratorRuntime = require("regenerator-runtime");
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
chai.use(require('chai-string'));


/*
const path = 'https://arturshams.files.wordpress.com/2015/07/sample1.jpg';
const lang = 'en';

const testObj = { locations: [],description: 'The quick brown fox\njumped over the 5\nazy dogs!\n',locale: 'en', confidence: 0 }
const returnedObj = getTextFromImage(path, lang);

describe('OCRService', function(){
  it('test object', function(done){

    //assert.deepEqual(returnedObj.textAnnotations[0].description, testObj.description);
    //assert.deepEqual(getTextFromImage(path, lang), testObj);
    //assert.equal("22","22");
    done();
    console.log(returnedObj);
  });
});
*/
