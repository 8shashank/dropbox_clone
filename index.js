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


var sync = require('./lib/sync/sync');
var dnodeClient = require("./lib/sync/sync-client");
var Pipeline = require("./lib/sync/pipeline").Pipeline;

var readline = require('readline');


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
            //console.log("data: " + data + " toSrc: " + toSrc + " fromPath " + fromPath);
            var toPath = data.srcPath + "/" + toSrc;
            //console.log("data: " + data + " toSrc: " + toSrc + " trgPath " + toPath);
            if(checkNoSyncFile(toSrc)){
                syncFile(fromPath,toPath);
            }
        });
        return data;
    }
});
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToTrg, function(toTrg){
            var fromPath = data.srcPath + "/" + toTrg;
            //console.log("data: " + data + " totrg: " + toTrg + " fromPath " + fromPath);
            var toPath = data.trgPath + "/" + toTrg;
            //console.log("data: " + data + " totrg: " + toTrg + " trgPath " + toPath);
            if(checkNoSyncFile(toTrg)){
                syncFile(fromPath,toPath);
            }
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

// Want to create a function that will never sync a specified file. User input so far that will
// write to a text file and keep track of no sync files.
function fileNeverSync(){
    console.log("Please enter a file to never sync. ");

    var rlInterface = readline.createInterface({ // Try to be a little more specific with your naming convention. Ex: 'rlInterface'
        input: process.stdin,
        output: process.stdout
    });
    rlInterface.setPrompt('File name> ');
    rlInterface.prompt();
    rlInterface.on('line', function (line) {console.log("The file you do not want to sync is " + line);
        if(checkNoSyncFile(line)){
            writeFile(line);
            rlInterface.close();
        }
        else{
            console.log(line + " is already in the no sync list.");
        }

    })
}

// Wrote a function to write to text files given the user input.
// There's already a writeFile function in fs, so this could be confusing. Would recommend naming something else.
function writeFile(filenosync){
    if(!fs.existsSync('neversyncfile.txt')){
        fs.writeFile('neversyncfile.txt', filenosync + '\n', function(err){
            if(err){
                throw err;
            }
            console.log(filenosync + " added to no sync log.");
        })
    }
    else{
        fs.appendFile('neversyncfile.txt', filenosync + '\n', function(err)
        {
            if(err){
                throw err;
            }
            console.log(filenosync + " added to no sync log.");
        })
    }
}

// Wrote a function to take in a file name and check if it's in the no sync list.
// Returns true if file is not found in no sync file. Returns false if it is and no sync.
function checkNoSyncFile(filename) {
    var noSyncArray = fs.readFileSync('neversyncfile.txt').toString().split('\n'); // Try to be a little more specific with your naming convention. Ex: 'noSyncArray'

    if (noSyncArray.indexOf(filename) === -1) {
        //console.log(filename + " was not found in log.");
        return true;
    }
    else {
        //console.log(filename + " was found in log and will not be synced.");
        return false;
    }
}

function askUserInput(){
    console.log("Press 1 to add file to no sync log or 2 to sync files. ");

    var rlInterface = readline.createInterface({ // Try to be a little more specific with your naming convention. Ex: 'rlInterface'
        input: process.stdin,
        output: process.stdout
    });
    rlInterface.prompt();
    rlInterface.on('line', function (line) {
        switch (line) { // Switch statement is cleaner and uses fewer lines.
            case '1':
                rlInterface.close();
                fileNeverSync();
                break;
            case '2':
                rlInterface.close(); // Try to always use semi-colons even though they aren't required.
                // A message is printed for user for the other options, so it might be a good idea to print one here.
                // Otherwise, the user might think something is wrong.
                console.log("Syncing files.");
                scheduleChangeCheck(1000, true);
                break;
            default: // Give the user an option to re-enter input. Maybe he or she just mistyped.
                console.log("Please enter a valid input (1 or 2): ");
                rlInterface.prompt();
        }
    })

}

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;
    askUserInput();
});
