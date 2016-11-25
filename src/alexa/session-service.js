'use strict';

const responseService = require('./response-service');

const onStarted = (requestId, session) => {
    console.log("onSessionStarted requestId=" + requestId + ", sessionId=" + session.sessionId);
};

const handleEndRequest = (callback) => {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using the Alexa chaos monkey, Have a nice day and enjoy reinvent!";
    var shouldEndSession = true;
    callback(null, {}, responseService.buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
};

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
// function onSessionEnded(sessionEndedRequest, session) {
//     console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
//         ", sessionId=" + session.sessionId);
//     // Add cleanup logic here
// }

module.export = {
    onStarted,
    handleEndRequest
}
