var fs = require('fs');
var utils = require('./dropboxuris');
var path = require("path");

var iterateDirectory = function(dirPath, operationOnFile, operationOnDirectory){
    // Modified from https://gist.github.com/liangzan/807712
    // TODO Async
    dirPath = utils.getPath(dirPath);

    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0){
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            operationOnFile(filePath);
          else
            iterateDirectory(filePath, operationOnFile, operationOnDirectory);
        }
    };
    operationOnDirectory(dirPath);
}

var removeDirectory = function(dirPath){
  iterateDirectory(dirPath, fs.unlinkSync, fs.rmdirSync);
  console.log("Removed the directory at " + dirPath);
}

var listDirectoryRecursively = function(dirPath){
    // iterateDirectory();
}

var createDirectoryIncludingParent = function(dirPath){
  // Based on http://lmws.net/making-directory-along-with-missing-parents-in-node-js
  dirPath = utils.getPath(dirPath);
  fs.mkdir(dirPath, function(err){
    if(err){
      if(err.code == 'ENOENT'){
        createDirectoryIncludingParent(path.dirname(dirPath));
      }
      else{
        fs.readdir(dirPath,function(err, files){
          if(err)
          {
              throw "Failed to create directory at "+dirPath ;
          }
        }); 
      }
    }
    console.log("Create directory at "+dirPath);
  });
}

module.exports = {
  iterateDirectory : iterateDirectory,
  removeDirectory : removeDirectory,
  createDirectory : createDirectoryIncludingParent
}