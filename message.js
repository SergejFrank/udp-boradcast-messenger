const conf = require('./conf');


exports.Message = {
    "type": "message",
    "id": conf.uuid,
    "name": conf.username,
    "text": "Hello Alice!"
};






exports.KeepAlive = {
        "type":"keepalive",
        "id":conf.uuid,
        "name":conf.username
}