const chai = require('chai');
const http = require('chai-http');
const app = require('../src/app');

const expect = chai.expect;
const assert = chai.assert;
chai.use(http);


describe('simple get test', function(){
  it('should return status 200', function(done){
    chai.request(app)
      .get('/')
      .end(function(err,res){
        if(err) return done(err);
        expect(res).to.be.html;
        expect(res).to.have.cookie;
        expect(res).to.have.status(200);
        done();
      });
  });
});


describe('simple post test', function(){
  it('should return status 200', function(done){
    chai.request(app)
      .post('/images')
      .end(function(err,res){
        if(err) return done(err);
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        done();
      });
  });
});
