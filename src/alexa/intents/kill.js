'use strict';

const chaosService = require('../../chaos-service');

module.exports = () => {
    return chaosService
        .terminate({ count: 1 })
        .then(() => ({
            sessionAttributes: {},
            cardTitle: "Kill",
            speechOutput:
                `Booooom`,
            repromptText: "",
            shouldEndSession: true
        }));
};
