/*import {translateFunc} from "../src/services/translation/translate_text";
const {Translate} = require('@google-cloud/translate');
const regeneratorRuntime = require("regenerator-runtime");
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
chai.use(require('chai-string'));


describe('simple hello translation test', function(){
  // simple translation test
  it('should return hello', function(done){
    const test = "Hejsan";
    translateFunc(test).then(function(result){
    assert.equal(result,"Hello");
    });
    done();
  });
});

describe('simple hello world translation test', function(){
  // simple translation test
  it('should return hello world', function(done){
    const test = "Hejsan värld"; // hello world according to google translate
    translateFunc(test).then(function(result){
    assert.equal(result,"Hello world");
    });
    done();
  });
});

describe('given no input', function(){
  it(`should throw an error`, async () => {
    expect(translateFunc()).to.be.rejectedWith(Error);
  });
});
*/
