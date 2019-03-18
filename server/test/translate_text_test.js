const getTranslation = require('../src/services/translation/translationService');
const regeneratorRuntime = require("regenerator-runtime");
import {mockTranslateResponse} from '../src/fakeData/mockTranslateResponse';

const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(require('chai-string'));
chai.use(require('chai-as-promised'));
chai.should();

const testText = "Hejsan";
const testResult = "Hello";
const testText_hw = "Hejsan värld"; //according to google translate
const testResult_hw = "Hello world";

// use stub
// gcloud client object
let fakeClient = {
  translate: function(input){
    return new Promise(function(resolve, reject){
      resolve(mockTranslateResponse[0]);
    });
  }
};

// return fake client
sinon.stub(getTranslation, 'createTranslateClient').callsFake(function createFake() {
    return fakeClient;
});

// create the fake client
const client = getTranslation.createTranslateClient();

describe('simple hello translation test', function(){
  // simple translation test
  it('should return hello', function(){
    const stub = sinon.stub(client, 'translate');
    stub.resolves(mockTranslateResponse[0]);
    getTranslation.translateText(testText,client).then(function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(testResult));
    }).catch(function(err){
      console.log(err);
    });
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});


describe('simple hello world translation test', function(){
  // simple translation test
  it('should return hello world', function(){
    const stub = sinon.stub(client, 'translate');
    stub.resolves(mockTranslateResponse[1]);
    getTranslation.translateText(testText_hw,client).then(function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(testResult_hw));
    }).catch(function(err){
      console.log(err);
    });
    stub.restore();
    expect(stub).to.have.been.calledOnce;
  });
});
