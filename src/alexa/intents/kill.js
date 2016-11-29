'use strict';

const chaosService = require('../../chaos-service');
const countHelper = require('./count-text-helper');

module.exports = (intent) => {
    const countSlot = intent.slots ? intent.slots.Count : null;

    const count = countSlot ? countSlot.value : 1;

    return chaosService
        .terminate({ count })
        .then((result) => {
            const terminatingCount = result.terminate && result.terminate.TerminatingInstances ?
                                        result.terminate.TerminatingInstances.length : 0;

            const countText = result.count ? countHelper.getCountText(result.count) : '';

            const text = terminatingCount > 0 ?
                        `Booooom. You just killed ${terminatingCount} ${terminatingCount === 1 ? 'server' : 'servers'}. ${countText}` :
                        `I didn't kill any servers. ${countText}`;

            return {
                sessionAttributes: {},
                cardTitle: "Kill",
                speechOutput: text,
                repromptText: "",
                shouldEndSession: true
            }
        });
};
