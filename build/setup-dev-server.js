const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  let ready
  const onReady = new Promise(r => ready = r)

  let indexHtml
  const update = () => {
    if(indexHtml) {
      ready()
      callback(indexHtml)
      console.log('server running at: http://localhost:9999')
    } else {
      callback('some error')
    }
  }

  const clientConfig = require('../webpack.config')
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true&reload=true',
    clientConfig.entry.app
  ]
  clientConfig.output.filename = '[name].js'
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent'
  })
  clientCompiler.hooks.done.tap('client', () => {
    indexHtml = clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/index.html'), 'utf-8') 
    update()
  })

  server.use(hotMiddleware(clientCompiler, {
    log: false
  }))

  server.use(clientDevMiddleware)

  return onReady
}