function ChatRoom(type,password) {
    this.name = type;
    this.password = password
}

ChatRoom.prototype.getHash = function () {
    return null; //Todo: calculate the hash
}

module.exports = Packet;