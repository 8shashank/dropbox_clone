#! /usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var readline = require('readline');
var nodemailer = require('nodemailer');
/* IN ORDER TO GET YOUR CODE TO WORK, I HAD TO npm install nodemailer manually. To prevent future users
 * from running into this problem, I troubleshooted and added "nodemailer": "1.4.0" to your dependencies in the package.json --LW
 */

/* Below, I provide one possible fix for the problem of all the messages going to one pre-defined person.
 * I suggest that you implement a very simple infrastructure that allows you to either change the recipient or default
 * to a default recipient. NB: I put my own email in here merely to facilitate testing, you should replace it. --LW
 */
var globalDefaultIntendedRecipient = 'lawrence.a.waller@vanderbilt.edu';

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
            emailMessager("Copied "+fromPath+" to "+toPath);
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

/* Small helper function to facilitate redefining default email recipient, see comments below. Might be a good idea. --LW */
function emailToWho(intended){
    if(intended!==undefined) { /* don't want to accidentally leave the email field blank, would overwrite default --LW */
        globalDefaultIntendedRecipient = intended;
        /* This... */
        console.log('Default recipient of changelog now set to ' + globalDefaultIntendedRecipient);
        /* ...lets you interact with client about the email business, which you weren't doing before. --LW */
    }
    else console.log('Please enter an email address to receive changelog messages');
}
/* END CHANGED CODE */

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
    emailMessager('Deleted ' + fileName);
}

/* see my suggestion below for how you could improve this --LW */
function rename(currentFileName, newFileName) {
    if(!currentFileName){
        console.log('Please enter a file to rename');
        return;
    }
    var path1 = argv.directory1 + '/' + currentFileName;
    var path2 = argv.directory2 + '/' + currentFileName;

    var path1new = argv.directory1 + '/' + newFileName;
    var path2new = argv.directory2 + '/' + newFileName;

    var handler1 = sync.getHandler(path1);
    var handler2 = sync.getHandler(path2);

    var handler1new = sync.getHandler(path1new);
    var handler2new = sync.getHandler(path2new);

    try {
        handler1.renameFile(path1,path1new , function(){});
        handler2.renameFile(path2, path2new, function(){});
    } catch (err) {
        console.log(err.message); /* while logging this error is better than not doing anything, it would be more helpful
                                   * if there was a way for you to show the client a list of files in the directory instead
                                   * so they know what they are picking from. It would take me too much time now to implement
                                   * that for you, but it's something to think about. --LW */
        return;
    }
    emailMessager('Renamed  ' + currentFileName + " to " + newFileName);
}

/* Why don't you improve this function so that the intended email recipient isn't hard-coded?
 * Because of javascript's wonderful habit of ignoring numbers of parameters, this doesn't break the rest of your legacy code,
 * but in the future you can take advantage of the added functionality. --LW
 */
function emailMessager(str, intendedEmailRecipient) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Vanderbilt DropBox  <vanderbilt.dropbox@gmail.com>', // sender address
        to: intendedEmailRecipient, // list of receivers
        subject: 'Dropbox updated ', // Subject line
        text: str, // plaintext body
        html: '<b>' + str + '</b>' // html body
    };

    if(intendedEmailRecipient===undefined) {
        mailOptions.to = globalDefaultIntendedRecipient;
        /* Why don't you reference a global variable for this, one that survives method scoping? See above.
         * That way, you can re-use it later on rather than having to decide at compile time who will get emails.
         */
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
    console.log(str);
}

// To add valid operations, map user input to the desired function
var userOps = {
    quit: null,
    emailToWho: function(in1) { /* It's not too much work to add in a helper method that lets the client
                                 * redefine the default email recipient of the messages... */
        emailToWho(in1);
    },
    rename: function (in1, in2) { /* Before, if you left in2 undefined, the name of your file would be changed to
                                   * "undefined", why don't you define a more descriptive default name? */
        if(in2===undefined)
            rename(in1, "defaultName.txt"); /* more descriptive default name */
        else rename(in1,in2);
    },
    test: function () { console.log('Test'); },
    func: function (in1, in2) { console.log(in1 + ' and ' + in2); },
    delete: del
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
            userOps[operation].apply(this, args);
        } else {
            console.log("Unknown option");
        }
        rl.prompt();
    });
}

/* This transporter seems to work properly. I tested it out and it correctly relayed messages to my email. --LW */
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vanderbilt.dropbox@gmail.com',
        pass: 'dropthebase'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

dnodeClient.connect({host:argv.server, port:argv.port}, function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
    getUserInput();
});
