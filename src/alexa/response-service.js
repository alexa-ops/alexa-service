'use strict';

const buildResponse = (sessionAttributes, title, output, repromptText, shouldEndSession) => ({
    version: '1.0',
    sessionAttributes,
    response: {
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
    }
});

module.exports = {
    buildResponse,
}
