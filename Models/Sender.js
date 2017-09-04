var conf = require("../conf.js")

function Sender() {
    this.name = conf.username;
    this.publicKey = conf.getPublicKey();
}

module.exports = Sender;
