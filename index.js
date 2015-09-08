#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');

var argv = require('yargs')
    .usage('Usage: dropbox [options]')
    .example('dropbox --directory1 dnode://test-data/folder1 --directory2 file://test-data/folder2 --i test.txt test2.txt', '(after launching the dropbox-server) listen for beacon signals with the given receiver id and reporting websocket url')
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
    .alias('a', 'active')
    .nargs('a', 1)
    .describe('a', 'Selective syncing boolean flag (i.e. 1: sync is on; 0: sync is off; defaults to 1)')
    .default('a', 1)
	//fixed here(youngho)
	.array('i')
	.alias('i', 'ignore')
	.describe('i',"Indicate a file in a dirrectory to ignore from sync process (e.g. //test-data/folder1")
	.default('i', null)
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
};

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

//hardcoding for instance of <=3 arguments due to yargs capabilities
var ignoreOptionArgs = argv.i;

function refineArgs(arr){
	var newArr = [];
	for(var i in arr){
		if(arr[i] != null){
			var parts = arr[i].split('/');
			newArr.push(parts[parts.length - 1]);
		}
	}
	return newArr;
}

function checkForChanges(){
    var path1 = argv.directory1;
    var path2 = argv.directory2;
	//should pass in ignoreOptionArgs instead of ignoredFiles because ignoredFiles is empty when entering this function.
    sync.compare(path1,path2,sync.filesMatchNameAndSize, refineArgs(ignoreOptionArgs), function(rslt) {

        rslt.srcPath = path1;
        rslt.trgPath = path2;

        writePipeline.exec(rslt);
    });
}

function scheduleChangeCheck(when,repeat){
    setTimeout(function(){
        if (syncIsActive()) {
            checkForChanges();
        }

        if(repeat){scheduleChangeCheck(when,repeat)}
    },when);
}

//made this a function in case something more powerful were to be implemented in the future
function syncIsActive() {
    return argv.a;
}

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
});


