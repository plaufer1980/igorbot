
'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config')

let bot = require('./bot')
let app = express()

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n Igor is here! \n') })

app.listen(config('PORT'), (err) => {
  if (err) throw err
  console.log(`\n Igorbot LIVES on PORT ${config('PORT')}`)

  if (config('SLACK_TOKEN')) {
    console.log(` Igor: @igor is real-time\n`)
    bot.connect(config('SLACK_TOKEN'), config('WIT_TOKEN'))
  }

})
