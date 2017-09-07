function Content(message) {
    this.data = message.getAsBase64();
    this.signature = message.sign(); //TODO Calculate the signature
}

Content.prototype.getAsBase64 = function(){
    return new Buffer(JSON.stringify(this)).toString('base64');
}

module.exports = Content;