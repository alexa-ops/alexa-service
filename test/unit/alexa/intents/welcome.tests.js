'use strict';

const expect = require('chai').expect;

const welcomeIntent = srcRequire('./alexa/intents/welcome');

describe('#welcomeIntent', () => {
    it('should return result', () => {
        welcomeIntent().then((result) => {
            expect(result).to.deep.equal({
                sessionAttributes: {},
                cardTitle: "Welcome",
                speechOutput:
                    `Welcome to reinvent 2016!
                    I am Alexa and I've been infused with the power of chaos monkey.
                    I can randomly kill E C 2 instances in my A W S test account.
                    You can ask me to kill, crush or destroy.
                    What would you like to do?`,
                repromptText: "You can ask me to kill, crush or destroy.",
                shouldEndSession: false
            })
        });
    });
});
