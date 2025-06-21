/**
 * Module dependencies.
 */

console.log('--- [www.js] Top of file, starting execution ---')

import app from '../app.js'
console.log('--- [www.js] Imported app from app.js ---')

import debugLib from 'debug'
import http from 'http'
const debug = debugLib('node-express-es6:server')
import { exit } from 'process'

// 導入dotenv 使用 .env 檔案中的設定值 process.env
import 'dotenv/config.js'
console.log('--- [www.js] dotenv/config.js imported ---')

/**
 * Get port from environment and store in Express.
 */
console.log(
  '--- [www.js] About to normalize port. process.env.PORT is:',
  process.env.PORT,
  '---'
)
var port = normalizePort(process.env.PORT || '3005')
console.log(`--- [www.js] Port normalized to: ${port} ---`)
app.set('port', port)
console.log('--- [www.js] Port set in Express app ---')

/**
 * Create HTTP server.
 */
var server = http.createServer(app)
console.log('--- [www.js] HTTP server created ---')

/**
 * Listen on provided port, on all network interfaces.
 */
console.log(`--- [www.js] Attempting to listen on port: ${port} ---`)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  console.log(`--- [www.js] normalizePort called with value: ${val} ---`)
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    console.log(
      `--- [www.js] normalizePort: Value is NaN, returning as named pipe: ${val} ---`
    )
    return val
  }

  if (port >= 0) {
    // port number
    console.log(
      `--- [www.js] normalizePort: Value is a valid port number: ${port} ---`
    )
    return port
  }

  console.log(
    `--- [www.js] normalizePort: Value is invalid, returning false ---`
  )
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  console.error('--- [www.js] onError event triggered ---')
  if (error.syscall !== 'listen') {
    console.error(
      '--- [www.js] onError: syscall is not "listen", re-throwing error ---',
      error
    )
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(
        '--- [www.js] onError: ' + bind + ' requires elevated privileges ---'
      )
      exit(1)
    case 'EADDRINUSE':
      console.error('--- [www.js] onError: ' + bind + ' is already in use ---')
      exit(1)
    default:
      console.error(
        '--- [www.js] onError: Unknown error, re-throwing error ---',
        error
      )
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log(
    '--- [www.js] onListening event triggered! Listening on ' + bind + ' ---'
  )
  debug('Listening on ' + bind)
}

console.log('--- [www.js] End of file, script setup complete ---')
