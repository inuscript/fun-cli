var send = require('../lib/')

send('foo', function(){
  process.exit(0)
})