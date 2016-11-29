'use strict';

const BbPromise = require('bluebird');
const chaosService = require('../../chaos-service');

const getTextResult = (text) => ({
    sessionAttributes: {},
    cardTitle: "Start",
    speechOutput: text,
    repromptText: "",
    shouldEndSession: true
});

module.exports = (intent) => {
    const MAX_SERVERS = 20;
    const countSlot = intent.slots ? intent.slots.Count : null;

    const count = countSlot ? countSlot.value : 1;
    const serversText = count === 1 ? 'server' : 'servers';

    if(count > MAX_SERVERS) {
        return BbPromise.resolve(getTextResult(`
            Woah Pony. You tried to start ${count} ${serversText}.
            But we only allow starting ${MAX_SERVERS} servers at a time.`
        ));
    }

    return chaosService
        .start({ count, size: 't2.nano' })
        .then((result) => {
            if(result.errorType) {
                switch(result.errorType) {
                    case 'InstanceLimitExceeded':
                        return getTextResult(`You instance limit is exceeded. You cannot start ${count} more ${serversText}`);
                    default:
                        return getTextResult('There was a problem starting those servers');
                }
            }

            return getTextResult(`I started ${count} ${serversText} for you.`);
        });
};
