var express = require('express');
var fs = require('fs');
var formidable = require('formidable');
var app = express();
app.use(express.static(__dirname));

/** Honor Citation: this post request based on an example from my Microsoft training guide "Programming in HTML5 with JavaScript and CSS", chapter 3 */
app.post('/Submit', function(request, response){
    var today = new Date();

    

    var myHTML = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Poor Man\'s Dropbox</title>' +
        '<link rel="stylesheet" type="text/css" href="/assets/basicstyle.css"/></head><body><header>' +
        '<h1 id="heading">Poor Man\'s Dropbox</h1><h3 id="wittyremark">"Quality Source Control...on a budget!"</h3>' +
        '</header></body></html>';

    var final = '<br />You should now close this window.';

        var form = new formidable.IncomingForm();
        form.parse(request, function(err, fields){
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write('Thank you for your business, ' + fields.userName + '!<br />');
            response.write('Your Comment has been processed. Please expect a reply within 24 hours.');
            response.end(myHTML + final);
            console.log("At timestamp " + today.toUTCString() + ",");
            console.log("server received comment from user " + fields.userName + ", who commented:");
            console.log("\"" + fields.textArea + "\"");
            console.log("Reply to " + fields.userName + " at " + fields.userEmail);

            var path = 'ClientMessageLog/commentlog.txt';
            var buffer = new Buffer("At timestamp " + today.toUTCString() + ", user "
                + fields.userName + " with email " + fields.userEmail + " commented: " + fields.textArea + "\n");

            /** Honor Citation: learned how to write to files with node.js (and borrowed some code from) the following link
             * http://stackoverflow.com/questions/2496710/writing-files-in-node-js
             */
            fs.open(path, 'a', function(err, fd) {
                if (err) {
                    throw 'error opening file: ' + err;
                }

                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, function() {
                        console.log("Comment has been stored in file commentlog.txt.\n");
                    })
                });
            });
        })
});

app.listen(8080);