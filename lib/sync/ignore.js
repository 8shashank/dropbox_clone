var fs = require('fs');
var uris = require("./dropboxuris");
var _ = require('lodash');

/*
  Check the file names in .ignore
  For the file names in .ignore, do not sync
*/
function ignoreFiles(path, files){
	var ignoreFile = ".ignore";
	var ignoreFilePath = uris.getPath(path) + "/" + ignoreFile;
	var data = fs.readFileSync(ignoreFilePath, "utf-8");
	var filesToIgnore = data.split("\n");
	var newList = _.difference(files, filesToIgnore);
	console.log("Files to sync: " + newList);
	return newList;
}

module.exports = {
    ignoreFiles:ignoreFiles
}
