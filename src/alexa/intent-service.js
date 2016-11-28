'use strict';

const responseService = require('./response-service');

const intentConfig = require('./intents.json');

const runIntent = (intentMapping, intent) => {
    const action = require(`./intents/${intentMapping}`);
    return action(intent).then(result => responseService.buildResponse(
        result.sessionAttributes,
        result.cardTitle,
        result.speechOutput,
        result.repromptText,
        result.shouldEndSession
    ));
}

const onLaunch = (launchRequest, session) => {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);
    return runIntent('welcome');
}

function onIntent(intentRequest, session) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    console.log(`Running ${intentName}`, intent);

    const intentMapping = intentConfig[intentName];

    if(intentMapping) {
        return runIntent(intentMapping, intent)
    }

    throw new Error(`Invalid intent ${intentName}`, intent);
}
const onExit = (sessionEndedRequest, session) => {
    console.log("onExit requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    return runIntent('exit');
}

module.exports = {
    onLaunch,
    onIntent,
    onExit,
}
