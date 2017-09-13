const uuidV4 = require('uuid/v4');

function Packet(type,chatRoom,content,aesKey) {
    this.id = uuidV4();
    this.type = type;
    this.chatRoom = chatRoom;
    this.content = content;
    this.aesKey = chatRoom;
}

module.exports = Packet;