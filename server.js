const conf = require('./conf');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
    server.setBroadcast(true)
});

server.bind(conf.port);


module.exports = server
