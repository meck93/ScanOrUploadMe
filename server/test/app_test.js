process.env.NODE_ENV ='test';
const app = require('../src/app');
const httpMocks = require('node-mocks-http');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.use(require('chai-string'));




describe('app.js ---> /home', function(){

  const expectedResponse = "Welcome to the ScanOrUploadMe REST API";
  it('should return status 200 and welcome message', function(done){
    // mock response
    const mockRequest = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });
    // mock request
    const mockResponse = httpMocks.createResponse();
    app(mockRequest, mockResponse);
    assert.equal(200, mockResponse.statusCode);
    const response = mockResponse._getData();
    assert.startsWith(response, expectedResponse);
    done();
  });
});


describe('app.js ---> /images', function(){
  it('should create a calendar event', function(done){
    // mock response
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/images'
    });

    // mock request
    const mockResponse = httpMocks.createResponse({});
    app(mockRequest, mockResponse);
    assert.equal(200, mockResponse.statusCode);
    assert.equal(true,mockResponse.end());
    done();
  });
});


describe('app.js ---> /images', function(){
  const expectedResponse = {"calendarEvent":null,"msg":"File upload failed!","uploaded":false,"success":false};
  const nullPlz = null;
  it('should not create a calendar event', function(done){
    // mock response
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/images',
      body: {
        base64: nullPlz
      }
    });
    // mock request
    const mockResponse = httpMocks.createResponse();
    app(mockRequest, mockResponse);
    assert.equal(200, mockResponse.statusCode);
    assert.equal(false,mockResponse.end());
    const response = JSON.parse(mockResponse._getData());
    assert.deepEqual(response, expectedResponse);
    done();
  });
});
