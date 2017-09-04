function Packet(type,chatRoom,content) {
    this.type = type;
    this.chatRoom = chatRoom;
    this.content = content; //TODO encrypt
}

module.exports = Packet;