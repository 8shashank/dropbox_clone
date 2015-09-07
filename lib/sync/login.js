/**
 * Created by tommy on 9/6/15.
 */

var fs = require('fs');
var prompt = require("prompt");
var crypto = require('crypto');

var uris = require('./dropboxuris');
var db = require('./db');

function promptLoginOrCreate(serverDirectory, afterLogin) {
    prompt.colors = false;
    prompt.start();

    prompt.get({
        properties: {
            answer: {
                description: "Would you like to create a new login? (Y/n)"
            }
        }
    }, function (err, result) {
        if (err) {
            if (err.message == 'canceled') process.exit();
            else throw err;
        }

        if (result.answer == 'Y' || result.answer == 'y') {
            showLogin(createLogin, afterLogin, serverDirectory);
        } else if (result.answer == 'N' || result.answer == 'n') {
            showLogin(loginExisting, afterLogin);
        } else {
            promptLoginOrCreate(serverDirectory, afterLogin);
        }
    });
}

var loginExisting = function (result, afterLogin) {
    db.getPassword(result.username, function (usernamePassword) {
        var hashedPassword = crypto.createHash('md5').update(result.password).digest('hex');
        if (hashedPassword != usernamePassword.password) {
            console.log('Wrong login!\n');
            promptLoginOrCreate(serverDirectory, afterLogin);
        } else {
            console.log('Login successful!\n');
            afterLogin(usernamePassword.username);
        }
    });
}

var createLogin = function (result, afterLogin, serverDirectory) {
    db.usernameExists(result.username, function (usernameExists) {
        if (!usernameExists) {
            if (!result.password) {
                result.password = '';
            }
            result.password = crypto.createHash('md5').update(result.password).digest('hex');
            db.addLogin(result, function (username) {
                // create user server directory
                console.log('Login created!\n');
                fs.mkdirSync(uris.getPath(serverDirectory)+"/"+username);
                afterLogin(username);
            });
        } else {
            console.log('Username already exists!\n');
            promptLoginOrCreate(serverDirectory, afterLogin);
        }
    });
}

function showLogin(callback, afterLogin, serverDirectory) {
    var schema = {
        properties: {
            username: {
                required: true
            },
            password: {
                hidden: true
            }
        }
    };

    prompt.colors = false;
    prompt.start();

    prompt.get(schema, function (err, result) {
        if (err) {
            if (err.message == 'canceled') process.exit();
            else throw err;
        }

        callback(result, afterLogin, serverDirectory);
    });
}

module.exports = {
    login: promptLoginOrCreate,
    createLogin: createLogin,
    loginExisting: loginExisting
}
