var fs = require('fs');
var uris = require("./dropboxuris");

/*
  Check the file names in .ignore
  For the file names in .ignore, do not sync
*/
function ignoreFiles(path, files){
	var ignoreFile = ".ignore";
	var ignoreFilePath = uris.getPath(path) + "/" + ignoreFile;
	var data = fs.readFileSync(ignoreFilePath, "utf-8");
	var filesToIgnore = data.split("\n");
	var newList = [];
	for(var i in files){
		var file = files[i];
		if(filesToIgnore.indexOf(file) == -1){
			newList.push(file);
		}
	}
	console.log("Files to sync: " + newList);
	return newList;
}

module.exports = {
    ignoreFiles:ignoreFiles
}
