/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

var request = require("request");

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

var printer = require('./printer');

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
    response.ask("Welcome! Let's start with some chitchat. What is your name?", "What is your name?");
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

function rewardAndAskNextQuestion(intent, session, response, answerQuestion, nextQuestion) {
    if (!session.attributes.successCounter) {
        session.attributes.successCounter = 0;
    } 
    session.attributes.successCounter = parseInt(session.attributes.successCounter, 10) + 1;
    if ((session.attributes.successCounter % 6) === 0) {
        printer.print(function(err) {
            if (err) {
                console.error(err);
            }
            var speechOutput = {
            speech: '<speak>' + answerQuestion + '<break strength="x-strong"/>Well done. Enjoy and dance. <audio src="https://s3-eu-west-1.amazonaws.com/alexa-talky/crazy.mp3" /><break strength="x-strong"/>' + nextQuestion + '</speak>',
                type: AlexaSkill.speechOutputType.SSML
            };
            response.ask(speechOutput, answerQuestion + " Well done. " + nextQuestion);
        });
    } else {
        var speechOutput = {
        speech: '<speak>' + answerQuestion + '<break strength="x-strong"/>' + nextQuestion + '</speak>',
            type: AlexaSkill.speechOutputType.SSML
        };
        response.ask(speechOutput, speechOutput);
    }
}

function weatherForCity(country, city, cb) {
    // a4864a1885b050d176c0c20ef1befbfb
    /*
    {
        "coord":{
            "lon":9.18,
            "lat":48.78
        },
        "weather":[
            {"id":500,"main":"Rain","description":"light rain","icon":"10d"}
        ],
        "base":"stations",
        "main":{
            "temp":281.04,
            "pressure":999,
            "humidity":93,
            "temp_min":280.15,
            "temp_max":282.15
        },
        "visibility":10000,
        "wind":{"speed":4.6,"deg":320},
        "clouds":{"all":75},
        "dt":1478355600,
        "sys":{"type":1,"id":4891,"message":0.0229,"country":"DE","sunrise":1478326665,"sunset":1478361321},
        "id":2825297,
        "name":"Stuttgart",
        "cod":200
    }
    */
    request.get({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&APPID=a4864a1885b050d176c0c20ef1befbfb",
        json: true
    }, function (err, response, body) {
        if (err) {
            cb(err);
        } else {
            console.log(typeof body);
            cb(null, body.weather[0].description);
        }
    });
}

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "MyNameIsIntent": function (intent, session, response) {
        session.attributes.Name = intent.slots.Name.value;
        rewardAndAskNextQuestion(intent, session, response, "Nice to meet you.", "How old are you " + session.attributes.Name + "?");
    },
    "MyAgeIsIntent": function (intent, session, response) {
        session.attributes.Age = intent.slots.Age.value;
        var answer = "";
        if (parseInt(session.attributes.Age, 10) > 29) {
            answer = "Oh, " + session.attributes.Age + " years. You have grown pretty old.";
        } else {
            answer = "Oh, " + session.attributes.Age + " years. You are quite young.";
        }
        rewardAndAskNextQuestion(intent, session, response, answer, "Do you want to know something about me, " + session.attributes.Name + "?");
    },
    "MyUSCityIsIntent": function (intent, session, response) {
        session.attributes.City = intent.slots.USCity.value;
        session.attributes.Coutry = "US";
        weatherForCity(session.attributes.Coutry, session.attributes.City, function(err, res) {
            if (err) {
                console.error(err);
                rewardAndAskNextQuestion(intent, session, response, "Interesting.", "What was the weather like yesterday?");
            } else {
                rewardAndAskNextQuestion(intent, session, response, "Nice, seems like you are having a " + res + " day.", "What was the weather like yesterday?");
            }            
        });
    },
    "MyDECityIsIntent": function (intent, session, response) {
        session.attributes.City = intent.slots.DECity.value;
        session.attributes.Coutry = "DE";
        weatherForCity(session.attributes.Coutry, session.attributes.City, function(err, res) {
            if (err) {
                console.error(err);
                rewardAndAskNextQuestion(intent, session, response, "Interesting.", "What was the weather like yesterday?");
            } else {
                rewardAndAskNextQuestion(intent, session, response, "Nice, seems like you are having a " + res + " day.", "What was the weather like yesterday?");
            }            
        });
    },
    "MyWeatherIsIntent": function (intent, session, response) {
        session.attributes.Weather = intent.slots.Weather.value;
        rewardAndAskNextQuestion(intent, session, response, "Always fun to talk about the weather. Isn't it?", "Goodbye! Hope to speak to you again soon.");
    },
    "AskAgeIntent": function (intent, session, response) {
        var age = 3 + parseInt(session.attributes.Age, 10);
        rewardAndAskNextQuestion(intent, session, response, "Thanks for asking. I am " + age + " years old.", "How do you feel?");
    },
    "AskFeelIntent": function (intent, session, response) {
        rewardAndAskNextQuestion(intent, session, response, "Thanks for asking.", "I am relaxed. What about you?");
    },
    "AskNameIntent": function (intent, session, response) {
        rewardAndAskNextQuestion(intent, session, response, "Thanks for asking.", "My name is Alexa. How do you feel?");
    },
    "IFeelPositiveIntent": function (intent, session, response) {
        rewardAndAskNextQuestion(intent, session, response, "I am happy to hear that you feel " + intent.slots.PositiveWord.value + ".", "Where are you from?");
    },
    "IFeelNegativeIntent": function (intent, session, response) {
        rewardAndAskNextQuestion(intent, session, response, "I am sad to hear that " + session.attributes.Name + ".", "Where are you from?");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    console.log(JSON.stringify(event));
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};

