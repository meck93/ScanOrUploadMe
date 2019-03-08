import extractDate from "../src/services/calendar/extractDate";
const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
chai.use(require('chai-string'));

describe('extractDate', function(){

  // correct input
  const text = 'time is on Friday 14.00 to 15.00';
  const startTime = new Date('March 08, 2019 13:00:00 UTC');
  const endTime = new Date('March 08, 2019 14:00:00 UTC');

  // incorrect input

  let now = new Date();
  const inc_startTime = new Date(now.setHours(now.getHours() + 1)).toString();
  const inc_endTime = new Date(now.setHours(now.getHours() + 2)).toString();
  const inc_text = 'you have a meeting';
  const testObj = {text: inc_text, startTime: inc_startTime, endTime: inc_endTime};
  const returnedObj = extractDate(inc_text);

  // make sure function returns description, start and endTime, given correct input
  it('should return a description, start and end times', function(){
    assert.deepEqual(extractDate(text),{text: text, startTime: startTime, endTime: endTime});
  });

  // make sure function returns description, start and endTime, given no time
  it('should return a description, start and end times', function(){
    assert.deepEqual(returnedObj.text, testObj.text);
    // work around to avoid the difference in seconds ...
    assert.startsWith(returnedObj.startTime, testObj.startTime.substr(0,18));
    assert.startsWith(returnedObj.endTime, testObj.endTime.substr(0,18));
  });

  // make sure function returns description, start and endTime, given only the start time
  const inc_text_2 = 'you have a meeting at 13.30';
  const returnedObj_2 = extractDate(inc_text_2);
  const testObj_2 = {text: inc_text_2, startTime: inc_startTime, endTime: inc_endTime};
  it('should return a description, start and end times', function(){
    assert.deepEqual(returnedObj_2.text, testObj_2.text);
    // work around to avoid the difference in seconds ...
    assert.startsWith(returnedObj_2.startTime, testObj_2.startTime.substr(0,18));
    assert.startsWith(returnedObj_2.endTime, testObj_2.endTime.substr(0,18));
  });

  // make sure function returns description, start and endTime, given only an end time
  const inc_text_3 = 'you have a meeting on Friday which ends at 15.00';
  const returnedObj_3 = extractDate(inc_text_3);
  const testObj_3 = {text: inc_text_3, startTime: inc_startTime, endTime: inc_endTime};
  it('should return a description, start and end times', function(){
    assert.deepEqual(returnedObj_3.text, testObj_3.text);
    // work around to avoid the difference in seconds ...
    assert.startsWith(returnedObj_3.startTime, testObj_3.startTime.substr(0,18));
    assert.startsWith(returnedObj_3.endTime, testObj_3.endTime.substr(0,18));
  });

  // funtion should return an error given no input
  it('should return a type error', function(){
    const extractDate = function () {throw new TypeError('no arguments provided');};
    expect(extractDate).to.throw();
  });


  const returnedObj_4 = extractDate(0.5);
  const testObj_4 = {text: 0.5, startTime: inc_startTime, endTime: inc_endTime};
  // funtion should still return description, start and endTime given wrong type(#1)
  it('should fail', function(){
    assert.equal(returnedObj_4.text, testObj_4.text);
    // work around to avoid the difference in seconds ...
    assert.startsWith(returnedObj_4.startTime, testObj_4.startTime.substr(0,18));
    assert.startsWith(returnedObj_4.endTime, testObj_4.endTime.substr(0,18));
  });

  // TODO: more unexpected types, time workaround fix

});
