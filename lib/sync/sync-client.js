var dnode = require('dnode');
var _ = require("lodash");
var fs = require('fs');
var uris = require("./dropboxuris");
var mkdirp = require('/mkdirp'); // Can't find this module.
var count = 0; // I'm not sure why this is a counter. Are you counting above 1 for any reason? It seems like it should just be a simple boolean value. This would make your code easier to understand.

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
            // Write a separate copy function for copying the file to the backup folder and put it either in sync.js or index.js.
            writeFile: function(path,base64data,cb){  // Goal: modify this to make a copy of a file before it gets written over, if it's an existing file.
                if (path === uris.getPath(path)) {// if file already exists)
                    if (count === 0) { // check to see if time-machine directory has already been created
                        mkdirp('assignment2-handin/test-data/tmdir2', function (err) { // if not, make it.
                            if (err) console.error(err); // asynchronous error handling
                            else console.log('No error in the backup directory creation.'); // You don't need to include this. It is assumed.
                        });
                    }
                    count++; // increment count so we know time-machine directory has been created
                    // If you used 'count' as a boolean, then you would just set it to true here.

                    this.readFile(path, function(d){ // asynchronously read the file and then write it to /tmdir2
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

