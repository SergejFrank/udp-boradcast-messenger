const ChatRoom = require('./Models/ChatRoom.js');

function RoomList() {
    var defaultChatRoom = new ChatRoom("Public","Public");
    this.activeRoom = defaultChatRoom;
    this.joinedRooms = [];
    this.addRoom(defaultChatRoom);
}

RoomList.prototype.setActiveRoom = function(identifier){
    var found = this.findRoom(identifier);
    if(found != null){
        this.activeRoom = found;
    }
}

RoomList.prototype.getActiveRoom = function(room){
    return this.activeRoom;
}

RoomList.prototype.addRoom = function(room){
    this.joinedRooms.push(room);
}

RoomList.prototype.findRoom = function(identifier){
    var chatRoom = new ChatRoom();
    return this.joinedRooms.find(function (room) {
        try {
            var tmp = chatRoom.getRoomName(identifier, room.password)
            if (tmp == room.name) {
                return room;
            }
        } catch (e) {
        }
    })
}

RoomList.prototype.entries = function(){
    return this.joinedRooms;
}

module.exports = RoomList;

