const crypto = require('../cryptUtils.js');

const key = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC5ck69xvj9wst7Zit2CKU63xFUffj4zKS/qAsLtx5vVoAQpgjG
MR2iqaCG0/Pbf3tyu/GUtbgIgHNMv0jQgzNhNwQTp4XAgx11Foi/BS8T75BK9kpO
ntFaDdQWVPR0wCmj+1SuPuqrlqFYK58J0L3UUisMAWY0D6lUzSy8a+IixQIDAQAB
AoGAY7Gv4xY0hTdTbONgOfQr35pMFsAiOJ7Lcr1EMuge1HwMHOclkGaXJ/tI8TLA
xh+ineur0+ZdKTTkxz2OR4pA8/f6UH6tZc8gfNhOHVcTRR5i9y/iW1adzOiZBFxf
Q4/33Tq0Ow/Fz4w/5/2vjww93Vit02wTedRoi6y3Ww9Wp4ECQQDaZP99mh1D/c5T
KJwD//UGSmiQ8w2wRBwdZnkVnr95eIb/O1zOJXc3FrTWaqLQJbWvZOq+VFMh+L7x
qSBxkTbXAkEA2WDveidclkV26tLXobtbASnTYLzIExtIlqJNG0S8JBSIvLpLIixy
Ut+XffTVPtCNJkv4nbNvK8EX6XFqosLrwwJBAKhAizz+0HEjRiN288t5FBJGnQye
0/rqXiagXcS0SpuQqaBU4YjIAHJmged2u/xUMQbxXpBHcsyHUMPpIl+cGn0CQHnz
rwZJ1OCdQfTFqqGaeZiyfVrVLi3B7bxMe5OjwSVAu+GdZg9a/hxOQjAwzf26hKWK
k4TtqJ3Ua3TU4y1Cy38CQGaE6KwFaVI6ZMyGqmtD3dKkH0mImk93+c/LdeJbM/WU
JJoz2Dge4+DmAg3fJnUFlq+eP80oqzT4IeFfxjusb4w=
-----END RSA PRIVATE KEY-----`

const conf = require('../conf.js')

function Message(sender,content) {
    this.sender = sender;
    this.content = content;
    this.timeStamp = 1000
    //this.timeStamp = Math.floor(Date.now() / 1000);
}

Message.prototype.sign = function(){
    var message = new Buffer(JSON.stringify(this)).toString('base64');
    console.log('message: ' + message);
    var signed = crypto.sign(message, key);
    console.log('signed: ' + signed);
    return signed;
}

module.exports = Message;
