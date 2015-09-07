var dnode = require('dnode');
var _ = require("lodash");
var fs = require('fs');
var uris = require("./dropboxuris");

function connect(options, onConnect, onError) {
    options = options || {};
    var port = options.port || 5004;
    var host = options.host || "127.0.0.1";
    
    var user = options.username || "username";
    var credential = options.credential || "credential";

    var d = dnode({},{weak:false});
    var conn = d.connect(host,port);
    var server = null;

    conn.on('remote', function (remote) {
        console.log("Connected to Dropbox remote");
        
        server = remote;

        server.verifyUser(
            user,
            credential,
            function(message){ // On Success
                if(message) {console.log(message);}

                onConnect({
                    list:function(path,cb){
                        path = uris.getPath(path);
                        server.list(path,cb);
                    },
                    stat:function(path,cb){
                        path = uris.getPath(path);
                        server.stat(path,cb);
                    },
                    writeFile: function(path,base64data,cb){
                        path = uris.getPath(path);
                        server.writeFile(path,base64data,cb);
                    },
                    readFile: function(path,cb){
                        path = uris.getPath(path);
                        server.readFile(path,cb);
                    }});
            },
            onError
        );
    });
};

module.exports = {
    connect: connect
}

