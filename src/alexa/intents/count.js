'use strict';

const chaosService = require('../../chaos-service');
const countHelper = require('./count-text-helper');

const getTextResult = (text) => ({
    sessionAttributes: {},
    cardTitle: "Count",
    speechOutput: text,
    repromptText: "",
    shouldEndSession: true
});

const getErrorResult = () => getTextResult(
    `Oh no, I encountered an error`
);

module.exports = () => chaosService
    .countBy({ selector: 'state' })
    .then(result => {
        const countText = countHelper.getCountText(result);
        return getTextResult(countText);
    })
    .catch(err => {
        console.error(err);
        return getErrorResult();
    });
