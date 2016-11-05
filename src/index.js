/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    response.ask("What is your name?", "What is your name?");
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "MyNameIsIntent": function (intent, session, response) {
        session.attributes.Name = intent.slots.Name.value;
        response.ask("How old are you, " + session.attributes.Name + "?", "How old are you, " + intent.slots.Name.value + "?");
    },
    "MyAgeIsIntent": function (intent, session, response) {
        session.attributes.Age = intent.slots.Age.value;
        response.ask("Do you want to know something about me, " + session.attributes.Name + "?", "Do you want to know something about me, " + session.attributes.Name + "?");
    },
    "AskAgeIntent": function (intent, session, response) {
        var age = 3 + parseInt(session.attributes.Age, 10);
        response.ask("Thanks for asking. I am " + age + " years old. How do you feel?", "Thanks for asking. I am " + age + " years old. How do you feel?");
    },
    "AskFeelIntent": function (intent, session, response) {

        response.ask("Thanks for asking. I am relaxed. What about you?");
    },
    "AskNameIntent": function (intent, session, response) {
        response.ask("Thanks for asking. My name is Alexa.", "Thanks for asking. My name is Alexa.");
    },
    "PlayIntent": function(intent, session, response) {
        var speechOutput = {
            speech: '<speak><audio src="https://s3-eu-west-1.amazonaws.com/alexa-talky/crazy.mp3" /></speak>',
            type: AlexaSkill.speechOutputType.SSML
        };
        response.ask(speechOutput, "Thanks for asking. My name is Alexa.");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    console.log(JSON.stringify(event));
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};

