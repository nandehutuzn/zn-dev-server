const express = require('express')
const setupDevServer = require('./build/setup-dev-server')

const server = express()

// 开发环境在 dist 目录下取不到
server.use('/dist', express.static('./dist'))

let indexHTML
let onReady = setupDevServer(server, (indexHtml) => {
  indexHTML = indexHtml
})

const send = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf8')
  res.end(indexHTML)
}

server.get('*', async (req, res) => {
  await onReady
  console.log('send')
  send(req, res)
})

server.listen(9999, () => {
  console.log('server running at: http://localhost:9999')
})