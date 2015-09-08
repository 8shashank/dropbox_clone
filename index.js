#! /usr/bin/env node

var sync = require('./lib/sync/sync');
var check = require('./lib/sync/check');
var dnodeClient = require('./lib/sync/sync-client");


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
    .default('s','127.0.0.1","127.0.0.1")
    .alias('s', 'server')
    .nargs('s', 1)
    .describe('p', 'The base port to connect to on the sync server')
    .alias('p', 'port')
    .nargs('p', 1)
    .default('p',5004,'5004")
    .epilog('Apache License V2 2015, Jules White')
    .argv;

var crypto = require ('crypto');
function encrypt(message){
    return crypto.createHash('sha1').update(message).digest('hex');
}

function checkForChanges(){
    var path1 = argv.directory1;
    var path2 = argv.directory2;

    check.compare(path1,path2,check.fileMatch, function(rslt) {

        rslt.srcPath = path1;
        rslt.trgPath = path2;

        sync.update(rslt);
    });
}

function scheduleChangeCheck(when,repeat){
    setTimeout(function(){
        checkForChanges();
        if(repeat) {scheduleChangeCheck(when,repeat)}
    },when);
}

var onConnectionSuccess = function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
}

var onConnectionError = function(errorMessage){
    console.log(errorMessage);
    process.exit(1);
    // #TODO: Find a better way to end the connection
    // that will not affect server connection.
}

dnodeClient.connect(
    {
        host:argv.server,
        port:argv.port,
        username: argv.username,
        credential: encrypt(argv.credential)
    },
    onConnectionSuccess,
    onConnectionError);


