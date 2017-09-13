var os = require('os');
var Netmask = require('netmask').Netmask;
const conf = require('./conf');

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
    broadcastIPs.forEach((ip)=>{
        var count = 3;
        for(count; count>0; count--){
            setTimeout(()=>_broadcast(msg,ip),count*50)
        }
    })
}

function _broadcast(msg,address){
    var message = new Buffer(msg);
    client.send(message, 0, message.length, conf.port, address, function(err, bytes) {
        if (err) throw err;
    });
}

exports.broadcast = broadcast;