
'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  WIT_TOKEN: process.env.WIT_TOKEN,
  ICON_EMOJI: ':robot_face:'
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}
