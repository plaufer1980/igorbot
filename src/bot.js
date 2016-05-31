
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const Botkit = require('botkit')
const Witbot = require('./witbot')
const os = require('os')

const connect = function(token, witToken) {
    let controller = Botkit.slackbot({
      debug: false
      //include "log: false" to disable logging
      //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
    });

    let bot = controller.spawn({
      token: token
    }).startRTM();

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

    controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {
      var hostname = os.hostname();
      var uptime = formatUptime(process.uptime());
      bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');
    });

    function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = uptime + ' ' + unit;
        return uptime;
    }

    if (witToken) {
      console.log(' Igor is running with NLP support.');
      // https://github.com/BeepBoopHQ/witbot
      let witbot = Witbot(witToken);

      controller.hears(['^nlp (.*)'], ['ambient'], function (bot, message) {
        var match = message.match[1];
        console.log("nlp match phrase: " + match);

        witbot.process(match, bot, message)
          .hears('car_buying', 0.53, function (bot, message, outcome) {
            bot.reply(message, 'Sounds like you want to buy a car!');
          })
          .hears('needs_drink', 0.53, function (bot, message, outcome) {
            bot.reply(message, 'Cheers! :beer:');
          })
          .otherwise(function (bot, message) {
            bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understand');
          });
      });
    }
};


module.exports = { connect: connect };
