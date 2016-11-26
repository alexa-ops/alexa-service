'use strict';

const BbPromise = require('bluebird');

module.exports = () => (BbPromise.resolve({
    sessionAttributes: {},
    cardTitle: "Session Ended",
    speechOutput:
        `Thank you for using the Alexa chaos monkey, Have a nice day and enjoy reinvent!`,
    repromptText: "",
    shouldEndSession: true
}));
