#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var readline = require('readline');

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

var promptedUpdate = false;

var sync = require('./lib/sync/sync');
var dnodeClient = require("./lib/sync/sync-client");
var Pipeline = require("./lib/sync/pipeline").Pipeline;


var syncFile = function(fromPath,toPath) {
    //promptedUpdate = true;

    //getUserInput();

    var srcHandler = sync.getHandler(fromPath);
    var trgHandler = sync.getHandler(toPath);
    var time = new Date();

    srcHandler.readFile(fromPath,function(base64Data){
        trgHandler.writeFile(toPath,base64Data,function(){
            console.log("Copied "+fromPath+" to "+toPath);
        })
    });


    console.log("change detected! directories were synced on " + time.getMonth() + "/" + time.getDay() + "/"  +
        time.getFullYear() + " at " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());

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

var timer;
function scheduleChangeCheck(when,repeat){
    timer = setTimeout(function(){
        checkForChanges();

        if(repeat){scheduleChangeCheck(when,repeat)}
    },when);
}

function del(fileName) {
    if(!fileName){
        console.log('Please enter a file to delete');
        return;
    }
    var path1 = argv.directory1 + '/' + fileName;
    var path2 = argv.directory2 + '/' + fileName;
    var handler1 = sync.getHandler(path1);
    var handler2 = sync.getHandler(path2);
    try {
        handler1.deleteFile(path1, function(){});
        handler2.deleteFile(path2, function(){});
    } catch (err) {
        console.log(err.message);
        return;
    }
    console.log('Deleting ' + fileName);
}

// To add valid operations, map user input to the desired function
var userOps = {
    quit: null,
    test: function () { console.log('Test'); },
    func: function (in1, in2) { console.log(in1 + ' and ' + in2); },
    delete: del
    update: //define the functionality of update
};

function getUserInput(){
    if (!promptedUpdate) {
        console.log('\nInput a command. Type "help" for available commands or "quit" to quit\n');
    }

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.prompt();
    rl.on('line', function(line) {
        var args = line.trim().split(' ');
        var operation = args.shift();

        //I'm not positive what is happening here.
        //I don't think promptedUpdate will ever be true
        //What cases is this supposed to be true?

        //In the case you wanted user input to check for sync update
        //you could call the checkForChanges function
        //the put a console.log statement if there are changes needed/notneeded
        if (promptedUpdate) {
            if (operation == 'update') {
                return;
            } else if (operation == 'exit') {
                promptedUpdate = false;
                break; // use a break statement to break out of the if statement.
            } else {
                console.log("unknown entry");
            }
        }

        if(operation == 'quit') {
            rl.close();
            clearTimeout(timer);
            dnodeClient.end();
            return;
        } else if (operation == 'help') {
            for (var op in userOps) {
                if (userOps.hasOwnProperty(op)) {
                    console.log(' * ' + op);
                }
            }
        } else if (userOps.hasOwnProperty(operation)) {
            userOps[operation].apply(this, args);
        } else {
            console.log("Unknown option");
        }
        rl.prompt();
    });
}

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
    getUserInput();
});
