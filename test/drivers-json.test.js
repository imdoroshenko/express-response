const assert = require('chai').assert
    , expect = require('chai').expect
    , sinon = require('sinon')
    , JSONDriver = require('../src/drivers/response/json.js')
describe('drivers/json.js', () => {
    let responseMock
    beforeEach(() => {
        responseMock = {
            type: sinon.spy(function () {return responseMock}),
            status: sinon.spy(function () {return responseMock}),
            json: sinon.spy(function () {return responseMock})
        }
    })
    it('should not throw exception if arguments ok', () => {
        expect(() => {
            JSONDriver(responseMock, {})
        }).to.not.throw(Error)
    })
    it('should set response type to \'application/json\'', () => {
        JSONDriver(responseMock, {status: 200})
        assert(responseMock.type.withArgs('application/json').calledOnce, 'wrong response type')
    })

    it('should set response status that have been send with arguments', () => {
        let args = [null, undefined, 0, '0', 200, 300, 500]
        args.forEach((arg) => {
            JSONDriver(responseMock, {status: arg})
        })
        args.forEach((arg) => {
            assert(responseMock.status.withArgs(arg).calledOnce, 'wrong response status')
        })
    })

    it('should set response value that have been send with arguments', () => {
        let args = [null, undefined, 0, '0', 1, {'test': 'value'}]
        args.forEach((arg) => {
            JSONDriver(responseMock, {response: arg})
        })
        args.forEach((arg) => {
            assert(responseMock.json.withArgs(arg).calledOnce, 'wrong response')
        })
    })

    it('should throw exception if first argument is object with wrong interface', () => {
        let args = [null, undefined, 0, '0', 1, {}]
        args.forEach((arg) => {
            expect(() => {
                JSONDriver(arg, {})
            }).to.throw(Error)
        })
    })

    it('should throw exception if second argument is null or undefined', () => {
        let resMock = {
            type: () => {},
            json: () => {}
        }
        expect(() => {
            JSONDriver(resMock, null)
        }).to.throw(Error)
        expect(() => {
            JSONDriver(resMock, undefined)
        }).to.throw(Error)
        expect(() => {
            JSONDriver(resMock)
        }).to.throw(Error)
    })
})
