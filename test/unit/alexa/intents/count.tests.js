'use strict';

const BbPromise = require('bluebird');

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const countIntentPath = srcPath('./alexa/intents/count');

const chaosService = {};

const countIntent = proxyquire(countIntentPath, {
    '../../chaos-service': chaosService
});

console.log('chaos-service', chaosService);

describe('#countIntent', () => {
    const getCountByStub = (result) =>
        sinon.stub(chaosService, 'countBy').returns(result);

    const expectCountByCalled = (countByStub) => {
        expect(countByStub.calledOnce).to.equal(true);
        expect(countByStub.args[0][1]).to.deep.equal({
            selector: 'state'
        });
    }

    const expectTextResult = (text, result) => {
        expect(result).to.deep.equal({
            sessionAttributes: {},
            cardTitle: "Count",
            speechOutput: text,
            repromptText: "",
            shouldEndSession: true
        })
    }

    it('should return total count - when no groups', () => {
        const countByStub = getCountByStub(BbPromise.resolve({
            total: 10,
        }))
        countIntent().then((result) => {
            expectCountByCalled(countByStub);
            expectTextResult(
                'The number of EC2 instances currently is 10',
                result
            );
        });
    });

    it('should return serverless when running group', () => {
        const countByStub = getCountByStub(BbPromise.resolve({
            total: 10,
            groups: [],
        }))
        countIntent().then((result) => {
            expectCountByCalled(countByStub);
            expectTextResult(
                `There are EC2 instances running.
                Congratulations, you are now Serverless.`,
                result
            );
        });
    });

    it('should return serverless count equals 0', () => {
        const countByStub = getCountByStub(BbPromise.resolve({
            total: 10,
            groups: [{
                key: 'running',
                value: 0,
            }]
        }))
        countIntent().then((result) => {
            expectCountByCalled(countByStub);
            expectTextResult(
                `There are EC2 instances running.
                Congratulations, you are now Serverless.`,
                result
            );
        });
    });

    it('should return running count', () => {
        const countByStub = getCountByStub(BbPromise.resolve({
            total: 10,
            groups: [{
                key: 'running',
                value: 3
            }]
        }))
        countIntent().then((result) => {
            expectCountByCalled(countByStub);
            expectTextResult(
                'The number of EC2 instances currently running is 3',
                result
            );
        });
    });
});
