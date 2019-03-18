const getText = require('../src/services/vision/OCRService');
const regeneratorRuntime = require("regenerator-runtime");
import {mockOcrResponse} from '../src/fakeData/mockOcrResponse';

const fs = require('fs');
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(require('chai-string'));
chai.use(require('chai-as-promised'));
chai.should();

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
const path = 'src/fakeData/image.png';
const path_inc = 'src/fakeData/free_image_test_upload.jpg';
const base64str = base64_encode('src/fakeData/image.png');
const base64str_inc = base64_encode('src/fakeData/free_image_test_upload.jpg');
const testObj = { locations: [],description: 'hello world\n',locale: 'en', confidence: 0 }


// use stub
// gcloud client object
let fakeClient = {
  textDetection: function(input){
    return new Promise(function(resolve, reject){
      resolve(mockOcrResponse[0]);
    });
  }
};

// return fake client
sinon.stub(getText, 'createOcrClient').callsFake(function createFake() {
    return fakeClient;
});

// create the fake client
const client = getText.createOcrClient();


describe('OCRService using uri with correct input', function(){
  it('should return an object after calling vision api', function(){
    const stub = sinon.stub(client, 'textDetection');
    stub.resolves(mockOcrResponse[0]);
    getText.getTextFromImage(path, client).then(function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(testObj));
    }).catch(function(err){
      console.log(err);
    });
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});

describe('OCRService using base64 with correct input', function(){
  it('should return an object after calling vision api', function(){
    const stub = sinon.stub(client, 'textDetection');
    stub.resolves(mockOcrResponse[0]);
    getText.getTextFromImageBase64(base64str, client).then(function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(testObj));
    }).catch(function(err){
      console.log(err);
    });
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});


describe('OCRService using uri with incorrect input', function(){
  it('should return error since textAnnotations of length 0', function(){
    const stub = sinon.stub(client, 'textDetection');
    stub.resolves(mockOcrResponse[1]);
    expect(getText.getTextFromImage(path_inc,client)).to.be.rejectedWith(Error);
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});

describe('OCRService using base64 with incorrect input', function(){
  it('should return error since textAnnotations of length 0', function(){
    const stub = sinon.stub(client, 'textDetection');
    stub.resolves(mockOcrResponse[1]);
    expect(getText.getTextFromImageBase64(base64str_inc,client)).to.be.rejectedWith(Error);
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});

describe('OCRService using uri when OCR response fails', function(){
  it('should return an OCR ERROR', function(){
    const stub = sinon.stub(client, 'textDetection');
    stub.resolves(mockOcrResponse[2]);
    expect(getText.getTextFromImage(path,client)).to.be.rejectedWith(Error);
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});

describe('OCRService using base64 when OCR response fails', function(){
  it('should return an OCR ERROR', function(){
    const stub = sinon.stub(client, 'textDetection');
    stub.resolves(mockOcrResponse[2]);
    expect(getText.getTextFromImageBase64(path,client)).to.be.rejectedWith(Error);
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});
