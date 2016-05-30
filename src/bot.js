
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const Botkit = require('botkit');

const connect = function(token) {
    let controller = Botkit.slackbot({
      debug: false
      //include "log: false" to disable logging
      //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
    });

    // connect the bot to a stream of messages
    let bot = controller.spawn({
      token: token
    }).startRTM();

    // give the bot something to listen for.
    controller.hears(['hello','hi'], ['direct_message','direct_mention','mention'], function(bot, message) {
      bot.reply(message, 'Hello yourself.');
    });

    controller.hears(['^You are a (.*)'], ['ambient'], function(bot, message) {
      var match = message.match[1];
      bot.reply(message, 'Your mom is a ' + match);
    });

    controller.on('channel_join', function(bot, message) {
      bot.reply(message, 'Hi ho! Great to have you here!');
    });

    controller.on('channel_leave', function(bot, message) {
      bot.reply(message, 'Hmm... it\'s always sad seeing people leave...');
    });

    controller.hears(['conversation please'], ['ambient'], function(bot, message) {
      var favColor = function(response, convo) {
        convo.ask('What\'s your favorite color?', function(response, convo) {
          convo.say('Interesting.');
          favAnimal(response, convo);
          convo.next();
        }, { 'key': 'color' });
      }

      var favAnimal = function(response, convo) {
        convo.ask('What\'s your favorite animal?', function(response, convo) {
          convo.say('Cute!');
          favDish(response, convo);
          convo.next();
        }, { 'key': 'animal' });
      }

      var favDish = function(response, convo) {
        convo.ask('What\'s your favorite dish?', function(response, convo) {
          convo.say('Yummy.');
          results(response, convo);
          convo.next();
        }, { 'key': 'dish' });
      }

      var results = function(response, convo) {
        convo.on('end', function(convo) {
          if (convo.status == 'completed') {
            bot.reply(message, 'Going to get you a ' + convo.extractResponse('color')
                + ' ' + convo.extractResponse('dish')
                + ' with ' + convo.extractResponse('animal') + '.');
          } else {
            bot.reply(message, 'Nevermind.');
          }
        });
      }

      bot.startConversation(message, favColor);
    });

};

module.exports = { connect: connect };
