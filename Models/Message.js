function Message(sender,content) {
    this.sender = sender;
    this.content = content;
    this.timeStamp = Math.floor(Date.now() / 1000);
}


module.exports = Message;