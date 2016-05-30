
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Igor',
  icon_emoji: config('ICON_EMOJI')
}

let attachments = [
  {
    title: 'Igorbot. Your personal Igor at your service!',
    color: '#2FA44F',
    text: '`/igor quote` returns hip Igor quotes',
    mrkdwn_in: ['text']
  },
  {
    title: 'Configuring Igorbot',
    color: '#E3E4E6',
    text: '`/igor help` ... you\'re lookin at it! \n',
    mrkdwn_in: ['text']
  }
]

const handler = (payload, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }
