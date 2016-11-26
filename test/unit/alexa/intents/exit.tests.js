'use strict';

const expect = require('chai').expect;

const exitIntent = srcRequire('./alexa/intents/exit');

describe('#exitIntent', () => {
    it('should return result', () => {
        exitIntent().then((result) => {
            expect(result).to.deep.equal({
                sessionAttributes: {},
                cardTitle: "Session Ended",
                speechOutput:
                    `Thank you for using the Alexa chaos monkey, Have a nice day and enjoy reinvent!`,
                repromptText: "",
                shouldEndSession: true
            })
        });
    });
});
