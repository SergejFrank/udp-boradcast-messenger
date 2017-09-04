
const uuidV4 = require('uuid/v4')
const crypto = require('./cryptUtils.js')
var username = require('username');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage(__dirname+'/local-storage');
}

var uuid;
var key;

if(localStorage.getItem('key') != null){
  key = localStorage.getItem('key');
  console.log(crypto.getPublicKeyFromPrivateKey(key));
}else{
  key = crypto.generatePrivateKey();
  localStorage.setItem('key', key);
}

if(localStorage.getItem("uuid") != null){
    uuid = localStorage.getItem('uuid')
}else{
    uuid = uuidV4();
    localStorage.setItem('uuid', uuid);
}

function getPublicKey(){
    return crypto.getPublicKeyFromPrivateKey(key);
}

exports.key = key;
exports.port = 34567;
exports.uuid = uuid;
exports.username = username.sync();
