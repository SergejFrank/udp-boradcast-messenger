const forge = require('node-forge');

/**
 * Calculates a RSA signature for the given data with the given private RSA key.
 * Uses an sha256 hash and UTF-8 for text decoding.
 * @param {string} text the text to sign (e.g. base64 string, json formatted object)
 * @param {string} privateKey the private RSA key to use (PEM format) 
 * @returns {string} returns the signature base64 encoded
 */
exports.sign = function (text, privateKey){
    var key = forge.pki.privateKeyFromPem(privateKey);
    
    var md = forge.md.sha256.create();
    md.update(text, 'utf8');
    var signature = key.sign(md);
    
    // var verified = publicKey.verify(md.digest().bytes(), signature);
    return forge.util.encode64(signature);
}

/**
 * Verifies an RSA signature for the given data and public RSA key.
 * Uses an sha256 hash and UTF-8 for text decoding.
 * @param {string} text the text which was signed (e.g. base64 string, json formatted object)
 * @param {string} signature the signature to verify (base64 encoded)
 * @param {string} publicKey the public RSA key which was used for signing (PEM format)
 * @returns {boolean} true, if the signature is valid
 */
exports.validate = function(text, signature, publicKey) {
    var key = forge.pki.publicKeyFromPem(publicKey);
    
    var md = forge.md.sha256.create();
    md.update(text, 'utf8');
    
    var rawSignature = forge.util.decode64(signature);
    var verified = key.verify(md.digest().bytes(), rawSignature);
    return verified;
}

/**
 * Generates a random 256 bit AES key.
 * @returns {string} the generated key (base64 encoded)
 */
exports.generateRandomAesKey = function() {
    var key = forge.random.getBytesSync(32);
    var b64encoded = forge.util.encode64(key);
    return b64encoded;
}

/**
 * Encrypts plain text with AES using the given key.
 * @param {string} plain the plain text to encrypt (e.g. base64 string, json formatted object)
 * @param {string} key the AES key to use for encryption (base64 encoded)
 * @returns {string} the encrypted data (base64 encoded)
 */
exports.aesEncrypt = function(plain, key) {
    var rawKey = forge.util.decode64(key);
    var iv = forge.random.getBytesSync(16);

    var cipher = forge.cipher.createCipher('AES-CBC', rawKey);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(plain));
    cipher.finish();
    var encrypted = cipher.output.bytes();
    var resultBuffer = forge.util.createBuffer(iv);
    resultBuffer.putBytes(encrypted);
    return forge.util.encode64(resultBuffer.data);
}

/**
 * Decrypts AES encrypted to plain text  using the given key.
 * @param {string} encrypted the encrypted data to decrypt (base64 encoded)
 * @param {string} key the AES key to used for encryption (base64 encoded)
 * @returns {string} the decrypted data
 */
exports.aesDecrypt = function(encrypted, key) {
    var encryptedRaw = forge.util.decode64(encrypted);
    var encryptedBuffer = forge.util.createBuffer(encryptedRaw);

    var rawKey = forge.util.decode64(key);
    var iv = encryptedBuffer.getBytes(16);

    var decipher = forge.cipher.createDecipher('AES-CBC', rawKey);
    decipher.start({iv: iv});
    decipher.update(encryptedBuffer);
    
    var result = decipher.finish();
    if(result == false)
        return null;

    return decipher.output.data;
}

/**
 * Encryptes plain text with a public RSA key.
 * @param {string} plain the text to encrypt (e.g. base64 string, json formatted object)
 * @param {string} publicKey the public RSA key to use for encryption (PEM format)
 * @returns {string} the encrypted data (base64 encoded)
 */
exports.rsaEncryptWithPublic = function(plain, publicKey) {
    var key = forge.pki.publicKeyFromPem(publicKey);

    var encrypted = key.encrypt(plain);
    
    var buffer = forge.util.createBuffer(encrypted);
    var encoded = forge.util.encode64(buffer.getBytes());
    return encoded;
}

/**
 * Decrpytes encrypted data with the private RSA key.
 * @param {string} encrypted the encrypted data to decrypt (base64 encoded)
 * @param {string} privateKey the private RSA key to use for decryption (PEM format)
 * @returns {string} the decrypted data
 */
exports.rsaDecryptWithPrivate = function(encrypted, privateKey) {
    var key = forge.pki.privateKeyFromPem(privateKey);
    var encryptedRaw = forge.util.decode64(encrypted);

    var decrypted = key.decrypt(encryptedRaw);
    return decrypted;
}