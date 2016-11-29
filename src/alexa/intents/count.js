'use strict';

const _ = require('lodash');
const chaosService = require('../../chaos-service');

const getTextResult = (text) => ({
    sessionAttributes: {},
    cardTitle: "Count",
    speechOutput: text,
    repromptText: "",
    shouldEndSession: true
});

const getTotalResult = (total) => getTextResult(
    `The number of E C 2 instances currently is ${total}`
);

const getServerlessResult = () => getTextResult(
    `You have no E C 2 instances running.
    Congratulations, you are now Serverless.`
);

const getRunningResult = (count) => getTextResult(
    `The number of E C 2 instances currently running is ${count}`
);

const getErrorResult = () => getTextResult(
    `Oh no, I encountered an error`
);

module.exports = () => chaosService
    .countBy({ selector: 'state' })
    .then(result => {
        if(!result.groups) {
            return result.total > 0 ?
                    getTotalResult(result.total) :
                    getServerlessResult()
        }

        // maybe can be done by pickBy ??
        const runningGroup = _.find(result.groups, (g) => g.key === 'running');

        const runningCount = runningGroup ? runningGroup.value : 0;

        return runningCount > 0 ?
                getRunningResult(runningCount) :
                getServerlessResult()
    })
    .catch(err => {
        console.error(err);
        return getErrorResult();
    });
