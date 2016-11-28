'use strict';

const chaosService = require('../../chaos-service');

module.exports = (intent) => {
    const countSlot = intent.slots ? intent.slots.Count : null;

    const count = countSlot ? countSlot.value : 1;

    return chaosService
        .terminate({ count })
        .then(() => ({
            sessionAttributes: {},
            cardTitle: "Kill",
            speechOutput:
                `Booooom`,
            repromptText: "",
            shouldEndSession: true
        }));
};
