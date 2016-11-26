'use strict';

const responseService = require('./response-service');
const sessionService = require('./session-service');

const buildResponse = (result) =>
    responseService.buildResponse(
        result.sessionAttributes,
        responseService.buildSpeechletResponse(result.cardTitle, result.speechOutput, result.repromptText, result.shouldEndSession)
    )

function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);
    require('./intents/welcome')()
            .then(result => callback(null, buildResponse(result)))
            .catch(err => callback(err));
}

function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("RandomKill" === intentName) {
        require('./intents/kill')()
            .then(result => callback(null, buildResponse(result)))
            .catch(err => callback(err));
    } else if ("CountInstances" === intentName) {
        require('./intents/count')()
            .then(result => callback(null, buildResponse(result)))
            .catch(err => callback(err));
    } else if ("AMAZON.HelpIntent" === intentName) {
        require('./intents/help')()
            .then(result => callback(null, buildResponse(result)))
            .catch(err => callback(err));
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        sessionService.handleEndRequest(callback);
    } else {
        throw new Error(`Invalid intent ${intentName}`, intent);
    }
}

module.exports = {
    onLaunch,
    onIntent,
}
