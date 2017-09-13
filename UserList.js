const Sender = require('./Models/Sender.js');

function UserList() {
    this.knownUser = {};
}


UserList.prototype.add = function(keepAlive){
    this.knownUser[keepAlive.sender.id] = keepAlive;
}


UserList.prototype.entities = function(){
    return Object.values(this.knownUser);
}

module.exports = UserList;