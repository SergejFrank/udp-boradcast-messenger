function Content(message) {
    this.data = message.getAsBase64();
    this.signature = message.sign(); //TODO Calculate the signature
}


module.exports = Content;