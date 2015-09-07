var fs = require('fs');
var set = require('simplesets');
var emailer = require('./emailer');

var checkUpdates = function(path, hours, changedFileList, callback){
    var millisInHour = 3600000;
    var now = (new Date()).getTime();
    var startTime = now - (millisInHour * hours);

    fs.readdir(path, function (error, fileList){
        if (error){
            return callback(error);
        }

        for (var file in fileList){
            var filename = path + '/' + fileList[file];
            var stats = fs.statSync(filename);

            var modifiedTime = stats.mtime.getTime();
            if (modifiedTime >= startTime){
                changedFileList.add(fileList[file]);
            }
        }

        return callback(null, changedFileList);
    });
};

var createEmailBody = function (changedFileList, hours){
    var correctUsageOfHours = ' hours';
    if (hours === 1) {
        correctUsageOfHours = ' hour';
    }

    var body = 'There were no updated files in the past ' + hours + correctUsageOfHours + '.\n';

    if (changedFileList.size() > 0){
        body = 'These files were updated in the past ' + hours + correctUsageOfHours + ':\n\n';

        changedFileList.each(function (item) {
            body += item;
            body += '\n';
        });
    }

    body += '\nSincerely,\nCS4278 Dropbox Team';

    return body;
};

var emailUpdates = function(path1, path2, emailAddress, hours){
    var changedFileList = new set.Set();
    checkUpdates(path1, hours, changedFileList, function (error1){
        if (error1){
            console.error(error1);
            return;
        }

        checkUpdates(path2, hours, changedFileList, function(error2) {
            if (error2){
                console.error(error2);
                return;
            }

            var emailBody = createEmailBody(changedFileList, hours);

            emailer.email(emailAddress, emailBody, function (err){
                if (err){
                    console.error(err);
                    return;
                } else {
                    console.log('Email successfully sent to ' + emailAddress + '.');
                }
            });
        })
    });
};

module.exports = {
    emailUpdates : emailUpdates
};