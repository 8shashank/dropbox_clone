var fs = require('fs');
var _ = require('lodash');
var sync = require('./lib/sync/sync');

var versionDir = ".prev_versions";

function writeNewVersion(fromPath,toPath,base64Data){
    var handler = sync.getHandler(fromPath);
    handler.writeFile(toPath,base64Data,function(){
        console.log("Saved " + fromPath + " as previous file version " + toPath);
    });
}

function overwrite(fromPath,toPath,base64Data){
    var handler = sync.getHandler(fromPath);
    handler.writeFile(toPath,base64Data,function(){
        console.log("Previous file version " + toPath + " overwritten by " + fromPath);
    });
}

function overwritePreviousVersions (dirPath,versions,newFile,newFileData){
    var versionDirPath = dirPath + "/" + versionDir;

    getCurrentVersionFileData(versionDirPath,versions,function(versionData){
        for (var i = 1; i < versions.length; i++) {
            var fromPath = versionDirPath + "/" + versions[i];
            var toPath = versionDirPath + "/" + versions[i-1];
            var overwriteData = versionData[versions[i]];
            overwrite(fromPath,toPath,overwriteData);
        }

        fromPath = dirPath + "/" + newFile;
        toPath = versionDirPath + "/" + versions[version.length-1];
        overwrite(fromPath,toPath,newFileData);
    });
}

// Runs asynchronously if a callback is supplied
// Else runs synchronously and returns the result
function getCurrentVersionFileData(dirPath,files,cb) {
    var curData = {};
    var finish = function(rslt){
        if (cb) {
            cb(rslt);
        } else {
            return result;
        }
    };

    if (files.length === 0) {
        finish(curData);
    } else {
        var handler = sync.getHandler(dirPath);

        var fileReadCallback = function(fileName,counter){
            return function(data){
                curData[fileName] = data;
                counter();
            }
        };

        var callbacks = 0;
        var counter = function(data){
            callbacks++;
            if (callbacks >= files.length) {
                finish(curData);
            }
        };

        _.each(files,function(file){
            var path = dirPath + "/" + file;
            var collector = fileReadCallback(file,counter);
            handler.readFile(path,collector);
        });
    }

}

function getPreviousVersions(path,filesToCheck,cb) {
    sync.getDirectoryInfo(path,function(directoryInfo){
        var fileList = directoryInfo.fileList;
        var matchingFiles = {};
        _.each(filesToCheck,function(file) {
            matchingFiles[file] = [];
            var regexStr = "\\(ver[0-9]+\\)" + _.escapeRegExp(file);
            var regex = new RegExp(regexStr);
            _.each(fileList, function (testFile) {
                if (regex.test(testFile)) {
                    matchingFiles[file].push(testFile);
                }
            });
        });
        cb(matchingFiles);
    })
}

function savePreviousVersions(dirPath,files,maxVersions) {
    var versionDirPath = dirPath + "/" + versionDir;

    // Must await completion of async calls here
    // File data must be read before continuing, as future syncing could create
    // race conditions trying to write files as we read
    var curData = getCurrentVersionFileData(dirPath,files);

    getPreviousVersions(versionDirPath,files,function(allVersions){
        _.each(files,function(file){
            var versions = allVersions[file];
            var fileData = curData[file];
            if (versions.length < maxVersions) {
                var fromPath = dirPath + "/" + file;
                var toPath = versionDirPath + "/(ver" + (versions.length+1) + ")" + file;
                writeNewVersion(fromPath,toPath,fileData);
            } else {
                overwritePreviousVersions(dirPath,versions,file,fileData);
            }
        });
    });
}

module.exports = {
    savePreviousVersions:savePreviousVersions
}
