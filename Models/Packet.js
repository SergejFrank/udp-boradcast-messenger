function Packet(type,chatRoom,content) {
    this.type = type;
    this.chatRoom = chatRoom.getHash();
    this.content = content; //TODO encrypt
}

module.exports = Packet;