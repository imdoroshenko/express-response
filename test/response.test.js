const expect = require('chai').expect
    , sinon = require('sinon')
    , Response = require('../src/response.js')
    , config = {
      defaultExceptionStatus: 500
    }

describe('response.js', () => {
  it('should instantiate without exceptions', () => {
  expect(() => {
      return new Response()
  }).to.not.throw(Error)
  })
  describe('response.js:use()', () => {
    let response = null
    beforeEach(() => {
      response = new Response()
    })
    it('should exist', () => {
      expect(response.use).to.be.a('function')
    })
    it('should properly apply response object', () => {
      let mock = {}
      response.use(mock)
      expect(response._res).to.be.equals(mock)
    })
    it('should be chainable', () => {
      expect(response.use({})).to.be.equals(response)
    })
  })

  describe('response.js:setConfig()', () => {
    let response = null
    beforeEach(() => {
      response = new Response()
    })
    it('should exist', () => {
      expect(response.setConfig).to.be.a('function')
    })
    it('should properly apply response object', () => {
      let mock = {}
      response.setConfig(mock)
      expect(response._config).to.be.equals(mock)
    })
    it('should be chainable', () => {
        expect(response.setConfig({})).to.be.equals(response)
    })
  })

  describe('response.js:success()', () => {
      let response = null,
          driverSpy = null
      beforeEach(() => {
        driverSpy = sinon.spy()
        response = new Response()
        response.setResponseDriver(driverSpy)
      })
      it('should exist', () => {
        expect(response.success).to.be.a('function')
      })
      it('should use injected driver', () => {
        response.success({})
        expect(driverSpy.calledOnce)
      })
      it('should send to driver correct data', () => {
        let testData = {}
        response.success(testData)
        expect(driverSpy.args[0][1]).to.have.property('response', testData)
      })
      it('should send to driver http status 200', () => {
        response.success({})
        expect(driverSpy.args[0][1]).to.have.property('status', 200)
      })
      it('should send to driver correct response object', () => {
        let responseMock = {}
        response.use(responseMock).success({})
        expect(driverSpy.args[0][0]).to.be.equals(responseMock)
      })
      it('should be chainable', () => {
        expect(response.success({})).to.be.equals(response)
      })
  })

  describe('response.js:error()', () => {
    let response = null,
        driverSpy = null
    beforeEach(() => {
      driverSpy = sinon.spy()
      response = new Response()
      response.setConfig(config)
      response.setResponseDriver(driverSpy)
    })
    it('should exist', () => {
      expect(response.error).to.be.a('function')
    })
    it('should use injected driver', () => {
      response.error({})
      expect(driverSpy.calledOnce)
    })
    it('should send to driver http status from config.http.defaultExceptionStatus if it is common exception', () => {
      response.error(new Error())
      expect(driverSpy.args[0][1]).to.have.property('status', config.defaultExceptionStatus)
    })
    it('should send to driver http status CustomException.http.httpStatus if it is custom exception', () => {
      let customException = {
          statusCode: 400
      }
      response.error(customException)
      expect(driverSpy.args[0][1]).to.have.property('status', customException.statusCode)
    })

    it('should be chainable', function () {
      expect(response.error(new Error())).to.be.equals(response)
    })
  })

})
