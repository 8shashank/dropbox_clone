#! /usr/bin/env node

var fs = require('fs');
var _ = require('lodash');
var dnode = require('dnode');
var base64util = require('./base64utils');

var argv = require('yargs')
    .usage('Usage: dropbox-server [options]')
    .example('dropbox-server -r ./', 'run the server with the current directory as the root')
    .alias('r', 'root')
    .nargs('r', 1)
    .default('r','./','the current working directory')
    .describe('r', 'The root directory')
    .describe('p', 'The port to listen on')
    .alias('p', 'port')
    .nargs('p', 1)
    .default('p',5004,'5004')
    .describe('c', 'The credentials file name')
    .alias('c', 'credentials')
    .nargs('c', 1)
    .default('c','./credentialsFile','The credentials file')
    .epilog('Apache License V2 2015, Jules White')
    .argv;


console.log('Sync files in '+argv.root+' and accept connections on port '+argv.port);

var base = argv.root;

// Initialize authentication
var Authentication = require('./authentication').Auth;
var auth = new Authentication(argv.credentials);

var server = dnode({
    list: function(path, cb){
        var rslt = fs.readdirSync(path);
        cb(rslt);
    },
    stat: function(path, cb){
        path = base + path;
        var state = fs.statSync(path);

        // Below is a workaround to a bug that I have not solved.
        // BUG: Without manually build a 'result', call isDirectory() on state will give undefined is not a function.
        var result = {
            'isDirectory':(state.isDirectory()? true:false),
            'ctime' : (state.ctime? state.ctime.getTime():-1),
            'size' : (state.size? state.size : -1)
        };

        cb(result);
    },
    writeFile: function(path, base64data, cb){
        base64util.writeFromBase64Encoded(base64data, base + path);
        cb();
    },
    readFile: function(path, cb){
        cb(base64util.readBase64Encoded(base + path));
    },
    verifyUser: function(username, password, successCB, errorCB){

        console.log('Receive authentication request for user: '+username);

        if(auth.authUser(username, password))
        {
            console.log('Log in user: '+username);
            successCB('Successfully log in user: '+ username);
        }
        else
        {
            console.log('Log in failed for user: '+username);
            errorCB('Sign in failed for user: ' + username);
        }
    }
},{weak:false});

server.listen(argv.port);


