#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var uris = require("./lib/sync/dropboxuris");
var path = require('path');

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
var Twit = require('twit');

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

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
});

//Establish connection with Twitter
function initiateTwitter(){
    var Twitter = new Twit({
        consumer_key: 'lF0toTHTD5BQxbvrfoy87scqz'
        , consumer_secret: 'ERq30rIPQlouR0qpNKrYDudsdpIzplmTxeAhz9C5RivmovZ8bK'
        , access_token: '3529755022-pSnr3zgRME4H1jK7hR6s109LCg1Ace8205EnmCO'
        , access_token_secret: 'xjmXeXsigPoDBYFY6ZGMDPKds0wQibf8iOZ599k1cs0R1'
    })

    var acceptableExt = [".gif",".png", ".webp", ".jpeg"];

    //Upload media to Twitter
    Twitter.upload = function uploadToTwitter(fileToUpload){

        var acceptable = false;
        var extension = path.extname(fileToUpload);

        /*for (var key in acceptableExt){
            if (extension === acceptableExt[key])
            {
                acceptable = true;
            }
        }*/
        //apparently there isn't a contains function so I think this is the next best thing
        acceptable = acceptableExt.indexOf(extension) >= 0;

        //The image passed should be the raw binary of the image or binary base64 encoded
        if (acceptable){
            var mediaContent= fs.readFileSync(fileToUpload, { encoding: 'base64' });
            Twitter.post('media/upload', { media_data: mediaContent }, function (err, data, response) {

                var mediaIdStr = data.media_id_string;
                var params = { media_ids: [mediaIdStr]};

                Twitter.post('statuses/update', params, function (err, data, response) {
                    console.log(fileToUpload + " uploaded.");
                })
            })
        }
        else
        {
            console.log(fileToUpload + " has unsupported format.");
        }
    };

    return Twitter;
}


var readline = require('readline');

//Will include an option for Facebook in the future
function initiate(){
    var socialMedia;
    socialMedia = initiateTwitter();
    return socialMedia
}

function uploadFiles(fileNames)
{
    var socialMedia = initiate();
    for(var key in fileNames)
    {
        //should double check that that file exists
        socialMedia.upload(uris.getPath(argv.directory1) + "/" + fileNames[key]);
    }
}

//Create handler to handle files in server
function serverHandler(path) {
    getFiles = function(path){
        return fs.readdirSync(path);
    }

    printFileNames = function(myFiles){
        console.log("Files in server folder:");
        for (var key in myFiles){
            console.log(myFiles[key]);
        }
        console.log("\n");
    }

    return {
        files: getFiles(path),
        printFileNames : printFileNames
    }
}

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
/*
    I wasn't able to get this to work since I am completely new to javascript but I was hoping to make
    it so that a user could keep entering files to upload to twitter.
 */
    getUserInput = function(message)
    {
        rl.question(message, function(answer)
        {
            if(answer === "quit")
            {
                return;
            }

            var fileNames = [];
            if (answer === "upload") {
                //Print out the files in the server folder
                var sHandler = serverHandler(uris.getPath(argv.directory1));
                var files = sHandler.files;
                sHandler.printFileNames(files);

                fileNames = files;
            }
            else
            {
                //var socialMedia = initiate();
                fileNames.push(answer);
            }
            //upload files with acceptable extensions
            uploadFiles(fileNames);

            rl.close();
            getUserInput("\nadditional files? otherwise type \"quit\" to stop\n");
        });
    }
    getUserInput("\nEnter 'upload' to upload all files in server folder to twitter or enter a filename to upload individual files\n");

