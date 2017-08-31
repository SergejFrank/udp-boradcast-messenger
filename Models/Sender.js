const conf = require('./conf');

function Sender() {
    this.name = conf.username;
    this.timestamp = null; //TODO: Generate Key
}

module.exports = Sender;