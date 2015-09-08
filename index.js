#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var readline = require('readline')
var moment = require('moment');

var argv = require('yargs')
    .usage('Usage: dropbox [options]')
    .example('dropbox --directory1 dnode://test-data/folder1 --directory2 file://test-data/folder2', '(after launching the dropbox-server) listen for beacon signals with the given receiver id and reporting websocket url')
    .demand(['d1','d2'])
    .alias('d1', 'directory1')
    .nargs('d1', 1)
    .describe('d1', 'The first directory to sync (e.g., dnode://test-data/folder1)')
    .alias('d2', 'directory2')
    .nargs('d2', 1)
    .describe('d2', 'The second directory to sync (e.g., file://test-data/folder2)')
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
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var syncFile = function(fromPath,toPath){
    var srcHandler = sync.getHandler(fromPath);
    var trgHandler = sync.getHandler(toPath);

    srcHandler.readFile(fromPath,function(base64Data){
    //THIS FEATURE REQUIRES THAT THE MOMENT PACKAGE BE INSTALLED.
    //OTHERWISE THIS WILL NOT RUN
        trgHandler.writeFile(toPath,base64Data,function(){
            console.log("Copied "+fromPath+" to "+toPath);
            rl.question("Enter your username: ", function(answer) {
                //Third Improvement: lose the close. Otherwise, the Log will only update once.
                var shortPath = fromPath.split('/');
                fs.appendFile('Log.txt', answer + " edited file " + shortPath[shortPath.length - 1] + " "
                    + moment().format('MMM Do YYYY, h:mm:ss a') + '\n', function(err) {
                    if (err)
                        throw err;

                });
                //second improvement
                console.log("File has been copied and log has been updated.")
            });
            /*fs.stat('Log.txt', function(err, stat) {
               if (err == null) {
                   //file exists
                   console.log(username);
                   fs.appendFile('Log.txt', username + " " + moment().format('MMMM Do YYYY, h:mm:ss a') + '\n', function(err) {
                      if(err)
                      throw error;
                   });
               } else if (err.code == 'ENOENT') {
                   //file does not exist; first log
                   fs.writeFile('log.txt', username + " " + moment().format('MMMM Do YYYY, h:mm:ss a') + '\n');
               }
            });*/
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

        if(repeat){scheduleChangeCheck(when,repeat)}
    },when);
}

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
});


