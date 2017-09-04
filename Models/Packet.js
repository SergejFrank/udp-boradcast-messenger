const uuidV4 = require('uuid/v4');

function Packet(type,chatRoom,content) {
    this.id = uuidV4();
    this.type = type;
    this.chatRoom = chatRoom;
    this.content = content; //TODO encrypt
}

module.exports = Packet;