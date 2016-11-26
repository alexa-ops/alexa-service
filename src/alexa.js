'use strict'

const BbPromise = require('bluebird');

const intentService = require('./alexa/intent-service');
const sessionService = require('./alexa/session-service');

const processEvent = (event) => {
    switch(event.request.type) {
        case 'LaunchRequest':
            return intentService.onLaunch(event.request, event.session);
        case 'IntentRequest':
            return intentService.onIntent(event.request, event.session);
        case 'SessionEndedRequest':
            return intentService.onExit(event.request, event.session);
        default:
            return BbPromise.reject(new Error(`Unknown request type ${event.request.type}`));
    }
}

module.exports.handler = function (event, context, cb) {
    if (event.session.application.applicationId !== process.env.ALEXA_APPLICATION_ID) {
        cb("Invalid Application ID");
    }

    if (event.session.new) {
        sessionService.onStarted(event.request.requestId, event.session);
    }

    processEvent(event)
        .then(result => cb(null, result))
        .catch(err => cb(err));
};
