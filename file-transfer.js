const fs = require('fs-extra');
var http = require('http');
var express = require('express');
var path = require('path');
var mime = require('mime');
const uuidV4 = require('uuid/v4');

var files = {};
var app = express();

app.get('/:id', function(req, res){
    var id = req.params.id;
    if(!files.hasOwnProperty(id) || !fileExists(files[id])){
        res.status(404);
        res.end();
        return;
    }

    var file = files[id];

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

var server = http.createServer(app).listen();
app.set('port', server.address().port);

console.log("Fileserver listening on "+app.get("port"));

var fileExists = function(filePath){
    return fs.existsSync(filePath);
};

var fileUpload_ = function(filePath,callback){
    if(!fs.existsSync(filePath)) return false;
    uuid = uuidV4();
    files[uuid] = filePath;
    callback({id: uuid, name: path.basename(filePath), port: app.get("port")});
};

var filetransfer = {
    fileUpload : fileUpload_
}

exports.filetransfer = filetransfer;