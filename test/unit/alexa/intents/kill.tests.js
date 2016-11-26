'use strict';

const BbPromise = require('bluebird');

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const killIntentPath = srcPath('./alexa/intents/kill');

const chaosService = { terminate: () => ({}) };

const killIntent = proxyquire(killIntentPath, {
    '../../chaos-service': {}
});

describe('#killIntent', () => {
    const getTerminateStub = (result) =>
        sinon.stub(chaosService, 'terminate').returns(result)

    const expectCountByCalled = (getTerminateStub) => {
        expect(getTerminateStub.calledOnce).to.equal(true);
        expect(getTerminateStub.args[0][1]).to.deep.equal({
            count: 1
        });
    }

    const expectTextResult = (text, result) => {
        expect(result).to.deep.equal({
            sessionAttributes: {},
            cardTitle: "Kill",
            speechOutput: text,
            repromptText: "",
            shouldEndSession: true
        })
    }

    it('should return total count - when no groups', () => {
        const countByStub = getTerminateStub(BbPromise.resolve())
        killIntent().then((result) => {
            expectCountByCalled(countByStub);
            expectTextResult(
                'Booooom',
                result
            );
        });
    });
});
