var os = require('os');
var Netmask = require('netmask').Netmask;
const conf = require('./conf');
const message_template = require('./message');

// CLIENT
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var broadcastIPs = [];



client.on('listening', function(){
    client.setBroadcast(true);
});


var interfaces = os.networkInterfaces();


Object.keys(interfaces).forEach(function (ifname) {
    iface = interfaces[ifname][0];
    if(iface.family != "IPv4" || ifname.startsWith("lo") || ifname.startsWith("docker")) return;
    var block = new Netmask(iface.address+'/'+iface.netmask);
    broadcastIPs.push(block.broadcast)
});

function broadcast(msg){
    var message = new Buffer(JSON.stringify(msg));
    broadcastIPs.forEach((ip)=>{
        _broadcast(message,ip)
    })
}

function _broadcast(message,address){
    client.send(message, 0, message.length, conf.port, address, function(err, bytes) {
        if (err) throw err;
    });
}

setInterval(function(){
    broadcast(message_template.KeepAlive)
},5000);

setTimeout(function(){
    broadcast(message_template.KeepAlive)
},500);

exports.broadcast = broadcast;