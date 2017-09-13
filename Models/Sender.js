var conf = require("../conf.js")
var crypto = require("../cryptUtils.js")

function Sender() {
    this.name = conf.username;
    this.publicKey;
    this.id;
    this.setPublicKey(conf.getPublicKey())
}

Sender.prototype.setName = function(name) {
    this.name = name;
};

Sender.prototype.setPublicKey = function(publicKey) {
    this.publicKey = publicKey;
    this.id = crypto.hashSha256(this.publicKey);
};

module.exports = Sender;
