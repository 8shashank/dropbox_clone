#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var readline = require('readline');
var uris = require("./lib/sync/dropboxuris");

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

var timer;
function scheduleChangeCheck(when,repeat){
   timer = setTimeout(function(){
        checkForChanges();

        if(repeat){scheduleChangeCheck(when,repeat)}
    },when);
}

function getList(path){
    var handler = sync.getHandler(path);
    console.log(handler.list(path));
}

//MY CONTRIBUTION
/*
* deleteFile
*
* takes a string for the name, searches for that file in the dropbox
*    and, if found, deletes it from both dnode and file directories
* */
function deleteFile(fName){
    if(!fName) {
        console.log("Please provide a valid filename to delete.");
        return;
    }
    //Trim() does not remove whitespace for some reason
    fName = fName.substring(0, fName.length-1);
    //need to actually get path
    var path1 = argv.directory1;
    var path2 = argv.directory2;
    var handler1 = sync.getHandler(path1);
    var handler2 = sync.getHandler(path2);

    var inList1 = listSearch(fName, uris.getPath(path1));
    var inList2 = listSearch(fName, uris.getPath(path2));

    if(!inList1 || !inList2){
        console.log("Requested file is not in the serverList");
        return;
    }

    path1 = path1+"/"+fName;
    path2 = path2+"/"+fName;
    try {
        handler1.removeFile(path1, function(){});
        handler2.removeFile(path2, function(){});
    }
    catch(err){
        console.log("Error removing the file");
        return;
    }

    console.log("Deleting file");
}

/*
*
* listSearch
*
* helper function for delete. takes a file name and a path a directory.
*    Searches through the directory and returns true if it finds a file
*    with the given name.
*
* */
function listSearch(name, path){
    console.log("searching lists");
    var list = fs.readdirSync(path);
    //console.log(list);
    for (var i = 0; i < list.length; i++){
        //console.log(name+" , "+list[i]);

        if(list[i] === name) {
            return true;
        }
    }
    return false;
}
//END MY CONTRIBUTION

//FOLLOWING GOTTEN FROM MASTER BRANCH COMMAND LINE INTERFACE
// To add valid operations, map user input to the desired function
var userOps = {
    quit: null,
    test: function () { console.log('Test'); },
    func: function (in1, in2) { console.log(in1 + ' and ' + in2); },
    delete: deleteFile
};

function getUserInput(){
    console.log('\nInput a command. Type "help" for available commands or "quit" to quit\n');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.prompt();
    rl.on('line', function(line) {
        var args = line.trim().split(' ');
        var operation = args.shift();
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
            if(operation == 'delete' && args.length > 1) {
                //+++++++++++++BUGFIX #1++++++++++++++++++//
                //if deleting and the file has spaces in its name, recombine arguments
                var name ='';
                for (var i = 0; i < args.length; i++) {
                    var name = name + args[i] + " ";
                }
                //WHY DOESN'T IT TRIM
                name.trim();
                args[0] = name;
                console.log(name);
                userOps[operation].apply(this, args);
                //------------BUGFIX #1 ----------------//

                //+++++++++++++ #2 ++++++++++++++++++//
                //Steps to delete more than one file at once:
                //Add a function to userOps called deletemultiple
                //if (operation == 'deletemultiple')
                //parse each file by finding each word with .txt
                //make a for loop looping through an array of the multiple .txt files
                //pass in each value through the userOps[operation].apply method
                //--------------- #2 -----------------//

            } else {
                userOps[operation].apply(this, args);
            }
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