/**
 * Created by tommy on 9/5/15.
 */

var mysql = require('mysql');
var crypto = require('crypto');
var connection;

function connectDb(query, value, callback) {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'user'
    });
    connection.connect();
    query(value, callback);
    connection.end();
}

function addLoginToDb(usernamePassword, queryFinished) {
    connectDb(function addLogin(usernamePassword, queryFinished) {
        if (!usernamePassword.password) {
            usernamePassword.password = '';
        }
        var hash = crypto.createHash('md5').update(usernamePassword.password).digest('hex');
        connection.query('INSERT INTO user VALUES("'+usernamePassword.username+'", "'+hash+'")',
            function (err) {
                if (err) throw err;
                queryFinished(usernamePassword.username);
            });
    }, usernamePassword, queryFinished);
}

function usernameExistsInDb(username, queryFinished) {
    connectDb(function usernameExists(username, queryFinished) {
        connection.query('SELECT username FROM user WHERE username="'+username+'"', function (err, rows) {
            if (err) { return next(err); }
            queryFinished(rows.length > 0);
        })
    }, username, queryFinished)
}

function getPasswordFromDb(username, queryFinished) {
    connectDb(function getPassword(username, queryFinished) {
        connection.query('SELECT * FROM user WHERE username="'+username+'"', function (err, rows) {
            if (err) { return next(err); }
            var password;
            if (rows.length != 0) {
                password = rows[0].password;
            }
            var login = {
                username: username,
                password: password
            }
            queryFinished(login);
        });
    }, username, queryFinished);
}

module.exports = {
    addLoginToDb: addLoginToDb,
    getPasswordFromDb: getPasswordFromDb,
    usernameExistsInDb: usernameExistsInDb
}