#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
// NOTE: I've removed .demand(['d1','d2']) from the args, can't figure out a way to demand either
// 'd1' and 'd2', or 'c'
var argv = require('yargs')
    .usage('Usage: dropbox [options]')
    .example('dropbox --directory1 dnode://test-data/folder1 --directory2 file://test-data/folder2', '(after launching the dropbox-server) listen for beacon signals with the given receiver id and reporting websocket url')
    .alias('d1', 'directory1')
    .nargs('d1', 1)
    .describe('d1', 'The first directory to sync (e.g., dnode://test-data/folder1)')
    .alias('d2', 'directory2')
    .nargs('d2', 1)
    .describe('d2', 'The second directory to sync (e.g., file://test-data/folder2)')
    .alias('sc', 'setconfiguration')
    .nargs('sc', 1)
    .describe('sc', 'Name of configuration to set')
    .alias('c', 'configuration')
    .nargs('c', 1)
    .describe('c', 'The name of a configuration you have set')
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

        if(repeat){scheduleChangeCheck(when,repeat)}
    },when);
}

// checks to see if the argv for 'c' has been defined and then calls on that configuration
function rememberSetupConfig() {
    var nameExistingConfig = argv.configuration;

    if (nameExistingConfig) {
        var rawData = fs.readFileSync(__dirname + '/config.txt').toString();
        var tempArr = rawData.split(" ");
        for (var i = 0; i < tempArr.length; i++) {
            if (tempArr[i] === nameExistingConfig) {
                argv.directory1 = ([tempArr[i + 1]].toString());
                argv.directory2 = ([tempArr[i + 2]].toString());
            }
        }
    }
}

// checks to see if the arv for 'sc' has been defined and then creates that configuation
function createSetupConfig() {
    var nametoSetConfig = argv.setconfiguration;
    var path1 = argv.directory1;
    var path2 = argv.directory2;
    if (nametoSetConfig) {
        fs.stat(__dirname + '/config.txt', function (err, stats) {
            if (err === null) {
                // this means the file already exists
                fs.appendFileSync(__dirname + '/config.txt', ' ' + nametoSetConfig + " " + path1 + " " + path2);
            } else {
                fs.writeFileSync(__dirname + '/config.txt', nametoSetConfig + " " + path1 + " " + path2);
            }
        })
    }
}

var ensureDemands = function (callback){

    if (argv.directory1 && argv.directory2 ){
        callback(null);
    }

    if (argv.configuration){
        callback(null);
    }

    if (!argv.directory1 && !argv.directory2 && !argv.configuration){
        callback('\nRun the program with either directory1 and directory2 or a configuration\n');
    }

};

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;

    ensureDemands(function (error){
        if (error){
            console.error(error);
            process.exit(1);

        } else {
            createSetupConfig();
            rememberSetupConfig();
            scheduleChangeCheck(1000, true);

        }
    });

});


