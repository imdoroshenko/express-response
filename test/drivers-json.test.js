var assert = require('chai').assert
    , expect = require('chai').expect
    , sinon = require('sinon')
    , JSONDriver = require('../src/drivers/response/json.js');
describe('drivers/json.js', function () {
    var responseMock;
    beforeEach(function () {
        responseMock = {
            type: sinon.spy(function () {return responseMock;}),
            status: sinon.spy(function () {return responseMock;}),
            json: sinon.spy(function () {return responseMock;})
        };
    });
    it('should not throw exception if arguments ok', function () {
        expect(function () {
            JSONDriver(responseMock, {});
        }).to.not.throw(Error);
    });
    it('should set response type to \'application/json\'', function () {
        JSONDriver(responseMock, {status: 200});
        assert(responseMock.type.withArgs('application/json').calledOnce, 'wrong response type');
    });

    it('should set response status that have been send with arguments', function () {
        var args = [null, undefined, 0, '0', 200, 300, 500];
        args.forEach(function (arg) {
            JSONDriver(responseMock, {status: arg});
        });
        args.forEach(function (arg) {
            assert(responseMock.status.withArgs(arg).calledOnce, 'wrong response status');
        });
    });

    it('should set response value that have been send with arguments', function () {
        var args = [null, undefined, 0, '0', 1, {'test': 'value'}];
        args.forEach(function (arg) {
            JSONDriver(responseMock, {response: arg});
        });
        args.forEach(function (arg) {
            assert(responseMock.json.withArgs(arg).calledOnce, 'wrong response');
        });
    });

    it('should throw exception if first argument is object with wrong interface', function () {
        var args = [null, undefined, 0, '0', 1, {}];
        args.forEach(function (arg) {
            expect(function () {
                JSONDriver(arg, {});
            }).to.throw(Error);
        });
    });

    it('should throw exception if second argument is null or undefined', function () {
        var resMock = {
            type: function () {},
            json: function () {}
        };
        expect(function () {
            JSONDriver(resMock, null);
        }).to.throw(Error);
        expect(function () {
            JSONDriver(resMock, undefined);
        }).to.throw(Error);
        expect(function () {
            JSONDriver(resMock);
        }).to.throw(Error);
    });
});
