'use strict';

const chaosService = require('../../chaos-service');

module.exports = () => {
    return chaosService
        .countBy({ selector: 'state' })
        .then(result => {
            return {
                sessionAttributes: {},
                cardTitle: "Count",
                speechOutput:
                    `The number of EC2 instances currently running is ${result.total}`,
                repromptText: "",
                shouldEndSession: true

            };
        })
        .catch(err => {
            return {
                sessionAttributes: {},
                cardTitle: "Count",
                speechOutput:
                    `Oh no, I encountered an error`,
                repromptText: "",
                shouldEndSession: true
            };
        });
};
