
const uuidV4 = require('uuid/v4')
var username = require('username');


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./local-storage');
}

var uuid;
if(localStorage.getItem("uuid") != null){
    uuid = localStorage.getItem('uuid')
}else{
    uuid = uuidV4();
    localStorage.setItem('uuid', uuid);
}


exports.port = 8888;
exports.uuid = uuid;
exports.username = username.sync();