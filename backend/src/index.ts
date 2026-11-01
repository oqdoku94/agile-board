import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT || '8080')

const server = app.listen(port, async () => {
  console.log('server started at port', port)
  console.log('listening:', server.listening)
})

server.on('error', (error) => {
  console.error('Server error:', error)
})

server.on('close', () => {
  console.log('Server closed')
})
