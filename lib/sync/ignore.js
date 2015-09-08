var fs = require('fs');
var uris = require("./dropboxuris");
var _ = require('lodash');

var IGNORE_FILE = ".ignore";

/*
  Check the file names in .ignore
  For the file names in .ignore, do not sync
*/
function ignoreFiles(path, files, cb){
	var ignoreFilePath = uris.getPath(path) + "/" + IGNORE_FILE;
	fs.readFile(ignoreFilePath, "utf-8", function(err, data){
        if (err) {
            throw err;
        } else {
            var filesToIgnore = data.split("\n");
            var newList = _.difference(files, filesToIgnore);
            console.log("Files to sync: " + newList);
            cb(newList);
        }
    });
}

module.exports = {
    ignoreFiles:ignoreFiles
}
