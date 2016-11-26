'use strict';

const BbPromise = require('bluebird');

module.exports = () => (BbPromise.resolve({
    sessionAttributes: {},
    cardTitle: "Help",
    speechOutput:
        `Welcome to reinvent 2016!
        This skill has implemented Netflix's chaos monkey program to randomly kill a server in our AWS test account.
        You can ask me to kill, crush or destroy.
        Why not give it a try?`,
    repromptText: "You can ask me to kill, crush or destroy.",
    shouldEndSession: false
}));
