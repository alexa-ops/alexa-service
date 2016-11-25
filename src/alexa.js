'use strict'

const responseService = require('./alexa/response-service');
const sessionService = require('./alexa/session-service');
const chaosService = require('./chaos-service');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
module.exports.handler = function (event, context, cb) {
    if (event.session.application.applicationId !== process.env.ALEXA_APPLICATION_ID) {
        cb("Invalid Application ID");
    }

    if (event.session.new) {
        sessionService.onStarted(event.request.requestId, event.session);
    }

    switch(event.request.type) {
        case 'LaunchRequest':
            onLaunch(event.request, event.session, (err, sessionAttributes, speechletResponse) => {
                cb(err, responseService.buildResponse(sessionAttributes, speechletResponse));
            });
            break;
        case 'IntentRequest':
            onIntent(event.request, event.session, (err, sessionAttributes, speechletResponse) => {
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

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("RandomKill" === intentName) {
        doKill(intent, session, callback);
    } else if ("CountInstances" === intentName) {
        doCount(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelp(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        sessionService.handleEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

// --------------- Functions that control the skill's behavior -----------------------
function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to reinvent 2016! I am Alexa and I've been infused with the power of chaos monkey. I can randomly kill E C 2 instances in my A W S test account. You can ask me to kill, crush or destroy. What would you like to do?";
    var repromptText = "You can ask me to kill, crush or destroy.";
    var shouldEndSession = false;
    callback(null, sessionAttributes, responseService.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelp(callback) {
    var sessionAttributes = {}
    var cardTitle = "Help";
    var speechOutput = "Welcome to reinvent 2016! This skill has implemented Netflix's chaos monkey program to randomly kill a server in our AWS test account. You can ask me to kill, crush or destroy. Why not give it a try?";
    var repromptText = "You can ask me to kill, crush or destroy.";
    var shouldEndSession = false;

    callback(null, sessionAttributes, responseService.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function doKill(intent, session, callback) {
    var cardTitle = "Kill";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var repromptText = "";
    console.log("kill");
    var speechOutput = "Booooom";

    chaosService
        .terminate({ count: 1 })
        .then(result => {
            callback(null, sessionAttributes, responseService.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession))
        })
        .catch(err => callback(err));
}

function doCount(intent, session, callback) {
    var cardTitle = "Kill";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var repromptText = "";
    console.log("kill");

    chaosService
        .terminate({ count: 1 })
        .then(result => {
            // parse stuff
            const count = 3;
            const speechOutput = "The number of EC2 instances currently running is " + count;
            callback(null, sessionAttributes, responseService.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        })
        .catch(err => {
            const speechOutput = "Oh no, I encountered an error";
            callback(null, sessionAttributes, responseService.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

}
