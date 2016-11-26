'use strict'

const intentService = require('./alexa/intent-service');
const responseService = require('./alexa/response-service');
const sessionService = require('./alexa/session-service');

module.exports.handler = function (event, context, cb) {
    if (event.session.application.applicationId !== process.env.ALEXA_APPLICATION_ID) {
        cb("Invalid Application ID");
    }

    if (event.session.new) {
        sessionService.onStarted(event.request.requestId, event.session);
    }

    switch(event.request.type) {
        case 'LaunchRequest':
            intentService.onLaunch(event.request, event.session, (err, sessionAttributes, speechletResponse) => {
                cb(err, responseService.buildResponse(sessionAttributes, speechletResponse));
            });
            break;
        case 'IntentRequest':
            intentService.onIntent(event.request, event.session, (err, sessionAttributes, speechletResponse) => {
                cb(err, responseService.buildResponse(sessionAttributes, speechletResponse));
            });
            break;
        case 'SessionEndedRequest':
            sessionService.handleEndRequest(event.request, event.session, cb);
            break;
        default:
            cb(`Unknown request type ${event.request.type}`);
    }
};
