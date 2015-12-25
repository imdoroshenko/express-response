var expect = require('chai').expect
    , sinon = require('sinon')
    , Response = require('../src/response.js')
    , config = {
      defaultExceptionStatus: 500
    };

describe('response.js', function () {
  it('should instantiate without exceptions', function () {
  expect(function () {
      return new Response();
  }).to.not.throw(Error);
  });
  describe('response.js:use()', function () {
    var response = null;
    beforeEach(function(){
      response = new Response();
    });
    it('should exist', function () {
      expect(response.use).to.be.a('function');
    });
    it('should properly apply response object', function () {
      var mock = {};
      response.use(mock);
      expect(response._res).to.be.equals(mock);
    });
    it('should be chainable', function () {
      expect(response.use({})).to.be.equals(response);
    });
  });

  describe('response.js:setConfig()', function () {
    var response = null;
    beforeEach(function(){
      response = new Response();
    });
    it('should exist', function () {
      expect(response.setConfig).to.be.a('function');
    });
    it('should properly apply response object', function () {
      var mock = {};
      response.setConfig(mock);
      expect(response._config).to.be.equals(mock);
    });
    it('should be chainable', function () {
        expect(response.setConfig({})).to.be.equals(response);
    });
  });

  describe('response.js:success()', function () {
      var response = null,
          driverSpy = null;
      beforeEach(function(){
        driverSpy = sinon.spy();
        response = new Response();
        response.setResponseDriver(driverSpy);
      });
      it('should exist', function () {
        expect(response.success).to.be.a('function');
      });
      it('should use injected driver', function () {
        response.success({});
        expect(driverSpy.calledOnce);
      });
      it('should send to driver correct data', function () {
        var testData = {};
        response.success(testData);
        expect(driverSpy.args[0][1]).to.have.property('response', testData);
      });
      it('should send to driver http status 200', function () {
        response.success({});
        expect(driverSpy.args[0][1]).to.have.property('status', 200);
      });
      it('should send to driver correct response object', function () {
        var responseMock = {};
        response.use(responseMock).success({});
        expect(driverSpy.args[0][0]).to.be.equals(responseMock);
      });
      it('should be chainable', function () {
        expect(response.success({})).to.be.equals(response);
      });
  });

  describe('response.js:error()', function () {
    var response = null,
        driverSpy = null;
    beforeEach(function(){
      driverSpy = sinon.spy();
      response = new Response();
      response.setConfig(config);
      response.setResponseDriver(driverSpy);
    });
    it('should exist', function () {
      expect(response.error).to.be.a('function');
    });
    it('should use injected driver', function () {
      response.error({});
      expect(driverSpy.calledOnce);
    });
    it('should send to driver http status from config.http.defaultExceptionStatus if it is common exception', function () {
      response.error(new Error());
      expect(driverSpy.args[0][1]).to.have.property('status', config.defaultExceptionStatus);
    });
    it('should send to driver http status CustomException.http.httpStatus if it is custom exception', function () {
      var customException = {
          statusCode: 400
      };
      response.error(customException);
      expect(driverSpy.args[0][1]).to.have.property('status', customException.statusCode);
    });

    it('should be chainable', function () {
      expect(response.error(new Error())).to.be.equals(response);
    });
  });

});
