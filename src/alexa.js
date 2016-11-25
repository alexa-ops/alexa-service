'use strict'
//Loading AWS SDK libraries

var AWS = require('aws-sdk');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
module.exports.handler = function (event, context) {
    try {
        //console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.application.applicationId !== "amzn1.ask.skill.69483f2c-0154-4cf1-a9d9-f7b697c65a54") {
             context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +", sessionId=" + session.sessionId);
}

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
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to reinvent 2016! I am Alexa and I've been infused with the power of chaos monkey. I can randomly kill E C 2 instances in my A W S test account. You can ask me to kill, crush or destroy. What would you like to do?";
    var repromptText = "You can ask me to kill, crush or destroy.";
    var shouldEndSession = false;
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelp(callback) {
    var sessionAttributes = {}
    var cardTitle = "Help";
    var speechOutput = "Welcome to reinvent 2016! This skill has implemented Netflix's chaos monkey program to randomly kill a server in our AWS test account. You can ask me to kill, crush or destroy. Why not give it a try?";
    var repromptText = "You can ask me to kill, crush or destroy.";
    var shouldEndSession = false;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using the Alexa chaos monkey, Have a nice day and enjoy reinvent!";
    var shouldEndSession = true;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function doKill(intent, session, callback) {
    var cardTitle = "Kill";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var repromptText = "";
    console.log("kill");
    var speechOutput = "Booooom";

    var lambda = new AWS.Lambda({
        region: 'us-east-1' //change to your region
    });

    lambda.invoke({
            FunctionName: 'chaos-service-dev-instanceTerminate',
            Payload: JSON.stringify({ count : 1}) // pass params
        }, function(error, data) {
        if (error) {
            context.done('error', error);
        }
        if(data.Payload){
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
    });

}

function doCount(intent, session, callback) {
    var cardTitle = "Kill";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var repromptText = "";
    console.log("kill");
    var speechOutput = "";

    var lambda = new AWS.Lambda({
        region: 'us-east-1' //change to your region
    });

    lambda.invoke({
            FunctionName: 'chaos-service-dev-instanceCount',
            Payload: JSON.stringify({ count : 1}) // pass params
        }, function(error, data) {
        if (error) {
            speechOutput = "Oh no, I encountered an error";
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
        if(data.Payload){
            // parse stuff
            var count = 3;
            speechOutput = "The number of EC2 instances currently running is " + count;
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
    });

}

// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
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
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
