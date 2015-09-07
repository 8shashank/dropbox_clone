var fs = require('fs');
var uris = require("./dropboxuris");

/*
  Check the file names in .ignore
  For the file names in .ignore, do not sync
*/
function ignoreFiles(path, files){
	console.log("ignoreFiles");
	var ignoreFile = ".ignore";
	var ignoreFilePath = uris.getPath(path) + "/" + ignoreFile;
	var data = fs.readFileSync(ignoreFilePath, "utf-8");
	var filesToIgnore = data.split("\n");
	console.log("ignore: " + filesToIgnore);
	console.log("sync: " + files);
	var newList = [];
	for(var i in files){
		var file = files[i];
		if(filesToIgnore.indexOf(file) == -1){
			//console.log("The file " + file + " is not in ignore list.");
			newList.push(file);
		}
	}
	console.log("Files to sync: " + newList);
	return newList;
}

module.exports = {
    ignoreFiles:ignoreFiles
}
