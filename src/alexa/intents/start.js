'use strict';

const chaosService = require('../../chaos-service');

module.exports = (intent) => {
    const countSlot = intent.slots ? intent.slots.Count : null;

    const count = countSlot ? countSlot.value : 1;

    return chaosService
        .start({ count, size: 't2.nano' })
        .then(() => ({
            sessionAttributes: {},
            cardTitle: "Kill",
            speechOutput:
                `I started ${count} ${count === 1 ? 'server' : 'servers'} for you.`,
            repromptText: "",
            shouldEndSession: true
        }));
};
