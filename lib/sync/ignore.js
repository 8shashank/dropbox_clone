var fs = require('fs');
var uris = require("./dropboxuris");

/*
  Check the file names in .ignore
  For the file names in .ignore, do not sync
*/
function ignoreFiles(path, files, cb){
	var ignoreFile = ".ignore";
	var ignoreFilePath = uris.getPath(path) + "/" + ignoreFile;
	listFilesToIgnore(ignoreFilePath, function(filesToIgnore) {
		var newList = [];
		for(var i = 0; i < files.length; ++i){
			var file = files[i];
			if(filesToIgnore.indexOf(file) == -1){
				newList.push(file);
			}
		}
		cb(newList);
	});
}

function listFilesToIgnore(ignoreFilePath, cb) {
	var data = fs.readFileSync(ignoreFilePath, "utf-8");
	var filesToIgnore = data.split("\n");
	for(var i = 0; i < filesToIgnore.length; ++i) {
		filesToIgnore[i] = filesToIgnore[i].trim();
	}
	cb(filesToIgnore);
}

module.exports = {
    ignoreFiles:ignoreFiles
}
