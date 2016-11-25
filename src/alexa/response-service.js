'use strict';

const buildSpeechletResponse = (title, output, repromptText, shouldEndSession) => ({
    outputSpeech: {
        type: "PlainText",
        text: output
    },
    card: {
        type: "Simple",
        title: title,
        content: output
    },
    reprompt: {
        outputSpeech: {
            type: "PlainText",
            text: repromptText
        }
    },
    shouldEndSession,
});

const buildResponse = (sessionAttributes, speechletResponse) => ({
    version: '1.0',
    sessionAttributes,
    response: speechletResponse
});

module.exports = {
    buildResponse,
    buildSpeechletResponse,
}
