var dnode = require('dnode');
var _ = require("lodash");
var fs = require('fs');
var uris = require("./dropboxuris");

var state = {connectStatus : false};
var mySession = null;

var clientDnode = dnode();
var server = null;
var conn = null;

clientDnode.on('end', function() {
    state.connectStatus = false;
});

function connect(options,onConnect) {
    var connectionCallBack = function (remote) {
        if(!server) {
            server = remote;
        }
        onConnect({
            list:function(path,cb){
                path = uris.getPath(path);
                server.list(path,mySession,cb);
            },
            stat:function(path,cb){
                path = uris.getPath(path);
                server.stat(path,mySession,cb);
            },
            writeFile: function(path,base64data,cb){
                path = uris.getPath(path);
                server.writeFile(path,mySession,base64data,cb);
            },
            readFile: function(path,cb){
                path = uris.getPath(path);
                server.readFile(path,mySession,cb);
            },
            deleteFile: function(path,cb){
                path = uris.getPath(path);
                server.deleteFile(path,mySession,cb);
            },
            login: function(username,password,success,error) {
                server.login(username, password,
                    function (session) {
                        console.log("Connected to Dropbox remote");
                        mySession = session;
                        state.connectStatus = true;
                        success();
                    },
                    function () {
                        state.connectStatus = false;
                        error();
                    });
            }
        });
    }

    if(!conn) {
        options = options || {};
        var port = options.port || 5004;
        var host = options.host || "127.0.0.1";
        conn = clientDnode.connect(host,port);
        conn.once('remote', connectionCallBack);
    } else {
        //Do not re-establish connection
        connectionCallBack(null);
    }
}

function disconnect() {
    clientDnode.end();
}

module.exports = {
    state: state,
    connect: connect,
    disconnect: disconnect
}
