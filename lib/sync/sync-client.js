var dnode = require('dnode');
var _ = require("lodash");
var fs = require('fs');
var uris = require("./dropboxuris");
var base64util = require("./base64utils"); //THIRD FIX
var mkdirp = require('mkdirp');//SECOND FIX: said "/mkdirp," should have just said "mkdirp"
var count = 0;

function connect(options,onConnect) {  // what are the options and onConnect arguments representing? options = server, onConnect = function
    options = options || {};
    var port = options.port || 5004;
    var host = options.host || "127.0.0.1";

    var d = dnode({}, {weak:false});
    var conn = d.connect(host,port);
    var server = null;

    conn.on('remote', function (remote) {
        console.log("Connected to Dropbox remote");
        server = remote;

        onConnect({    // is this putting an object in as an argument for some onConnect function?  // abstraction for remote file system
            list:function(path,cb){
                path = uris.getPath(path);
                server.list(path,cb);
            },
            stat:function(path,cb){
                path = uris.getPath(path);
                server.stat(path,cb);
            },
            writeFile: function(path,base64data,cb){  // Goal: modify this to make a copy of a file before it gets written over, if it's an existing file.
                console.log(path);
                console.log(uris.getPath(path));
                //TEST BELOW WILL NEVER BE TRUE, SEE REVIEW FOR EXPLANATION
                //  if (path === uris.getPath(path)) {// if file already exists) //REVIEW:
                //FIRST FIX - use stat (or, cuz idk asynchronicity, statSync) and check if it's a file.
                if( fs.statSync(uris.getPath(path)).isFile()){
                    console.log("it's a file'");
                    if (count === 0) { // check to see if time-machine directory has already been created
                        console.log("creating tmdir on client-side");
                        //fixed
                        mkdirp('test-data/tmdir2', function (err) { // if not, make it.
                            if (err) console.error(err); // asynchronous error handling
                            else console.log('No error in the backup directory creation.');
                        });
                        console.log("created!");
                    }
                    count++; // increment count so we know time-machine directory has been created
                    this.readFile(path, function(d){ // asynchronously read the file and then write it to /tmdir2
                        console.log("writing into tmdir2");
                        base64util.writeFromBase64Encoded('assignment2-handin/test-data/tmdir2', d);
                    });

                }
                path = uris.getPath(path);
                server.writeFile(path,base64data,cb);
            },
            readFile: function(path,cb){
                path = uris.getPath(path);
                server.readFile(path,cb);
            }
        });
    });
};

module.exports = {
    connect:connect
}

