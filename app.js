const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")
const moment = require("moment")
const fs = require("fs")

const PORT = process.env.PORT || 3200
const ES_ROOT = "http://icam-dev-mysql1:9200"
const LOG_FILE = "server.log"

let app = express()

app.use(bodyParser.json())

app.use(function(req, res, next) {
  let url = req.url
  let method = req.method
  let body = req.body
  let ip = req.connection.remoteAddress
  let time = moment().format("YYYY-MM-DD HH:mm:ss")
  let buffer = ""
  let line
  line = `[${time}][${ip}]${method} ${url}`
  console.log(line)
  buffer += line + "\n"
  line = JSON.stringify(body)
  console.log(line)
  buffer += line + "\n"
  fs.appendFileSync(LOG_FILE, buffer)
  next()
})

app.use(function(req, res) {
  let url  = req.url
  let method = req.method
  let body = req.body
  request({
    url: ES_ROOT + url
  , method: method
  , body: JSON.stringify(body)
  }, (error, response, body) => {
    if (error) console.log(error)
    res.status(response.statusCode).send(body)
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
});

