#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');

var argv = require('yargs')
    .usage('Usage: dropbox [options]')
    .example('dropbox -u username -c credential --d1 dnode://test-data/folder1 --d2 file://test-data/folder2', 
            '(after launching the dropbox-server) listen for beacon signals with the given receiver id and reporting websocket url')
    .demand(['u','c','d1','d2'])
    .alias('u', 'username')
    .nargs('u', 1)
    .describe('u', 'The dropbox username')
    .alias('c', 'credential')
    .nargs('c', 1)
    .describe('c', 'The password to the given username')
    .alias('d1', 'directory1')
    .nargs('d1', 1)
    .describe('d1', 'The remote directory to sync')
    .alias('d2', 'directory2')
    .nargs('d2', 1)
    .describe('d2', 'The local directory to sync')
    .describe('s', 'The sync server (defaults to 127.0.0.1)')
    .default('s',"127.0.0.1","127.0.0.1")
    .alias('s', 'server')
    .nargs('s', 1)
    .describe('p', 'The base port to connect to on the sync server')
    .alias('p', 'port')
    .nargs('p', 1)
    .default('p',5004,"5004")
    .epilog('Apache License V2 2015, Jules White')
    .argv;


var sync = require('./lib/sync/sync');
var dnodeClient = require("./lib/sync/sync-client");
var Pipeline = require("./lib/sync/pipeline").Pipeline;
var encrypt = require("./lib/sync/authentication").encrypt;

var syncFile = function(fromPath,toPath){
    var srcHandler = sync.getHandler(fromPath);
    var trgHandler = sync.getHandler(toPath);

    srcHandler.readFile(fromPath,function(base64Data){
        trgHandler.writeFile(toPath,base64Data,function(){
            console.log("Copied "+fromPath+" to "+toPath);
        })
    });
}

var writePipeline = new Pipeline();
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToSrc, function(toSrc){
            var fromPath = data.trgPath + "/" + toSrc;
            var toPath = data.srcPath + "/" + toSrc;
            syncFile(fromPath,toPath);
        });
        return data;
    }
});
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToTrg, function(toTrg){
            var fromPath = data.srcPath + "/" + toTrg;
            var toPath = data.trgPath + "/" + toTrg;
            syncFile(fromPath,toPath);
        });
        return data;
    }
});

function checkForChanges(){
    var path1 = argv.directory1;
    var path2 = argv.directory2;

    sync.compare(path1,path2,sync.filesMatchNameAndSize, function(rslt) {

        rslt.srcPath = path1;
        rslt.trgPath = path2;

        writePipeline.exec(rslt);
    });
}

function scheduleChangeCheck(when,repeat){
    setTimeout(function(){
        checkForChanges();
        if(repeat) {scheduleChangeCheck(when,repeat)}
    },when);
}


var encryptCredential = encrypt(argv.credential);

dnodeClient.connect(
    {
        host:argv.server,
        port:argv.port,
        username: argv.username,
        credential: encryptCredential
    },
    function(handler){
        /*
        sync.fsHandlers.dnode = handler;
        scheduleChangeCheck(1000,true);
        */
    },
    function(errorMessage){
        console.log(errorMessage);
        process.exit(1);
    });


