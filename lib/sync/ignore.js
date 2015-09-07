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
	for(var index = 0; i < files.length; ++index){
		var file = files[i];
		if(filesToIgnore.indexOf(file) == -1){
			newList.push(file);
		}
	}
	return newList;
}

module.exports = {
    ignoreFiles:ignoreFiles
}
