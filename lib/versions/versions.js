var fs = require('fs');
var _ = require('lodash');
var sync = require('../sync/sync');
var uris = require('../sync/dropboxuris');
var path = require('path');

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
    var versionDirPath = path.join(dirPath, versionDir);

    getCurrentVersionFileData(versionDirPath,versions,function(versionData){
        for (var i = 1; i < versions.length; i++) {
            var fromPath = path.join(versionDirPath, versions[i]);
            var toPath = path.join(versionDirPath, versions[i-1]);
            var overwriteData = versionData[versions[i]];
            overwrite(fromPath,toPath,overwriteData);
        }

        fromPath = path.join(dirPath, newFile);
        toPath = path.join(versionDirPath, versions[version.length-1]);
        overwrite(fromPath,toPath,newFileData);
    });
}

function getCurrentVersionFileData(dirPath,files,cb) {
    var curData = {};

    if (files.length === 0) {
        cb(curData);
    } else {
        var handler = sync.getHandler(dirPath);

        var fileReadCallback = function(fileName,counter){
            return function(data){
                curData[fileName] = data;
                counter();
            }
        };

        var callbacks = 0;
        var counter = function(){
            callbacks++;
            if (callbacks >= files.length) {
                cb(curData);
            }
        };

        _.each(files,function(file){
            var path = path.join(dirPath, file);
            var collector = fileReadCallback(file,counter);
            handler.readFile(path,collector);
        });
    }

}

function getPreviousVersions(path,filesToCheck,cb) {
    try{
        fs.mkdirSync(uris.getPath(path));
    } catch(e){
        if (e.code != "EEXIST") {
            throw e;
        }
    }
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

function savePreviousVersions(dirPath,files,dataFiles,maxVersions) {
    var versionDirPath = path.join(dirPath, versionDir);

    getPreviousVersions(versionDirPath,files,function(allVersions){
        _.each(files,function(file){
            var versions = allVersions[file];
            var fileData = dataFiles[file];
            if (versions.length < maxVersions) {
                var fromPath = path.join(dirPath, file);
                var toPath = path.join(versionDirPath,
                    '(ver' + (versions.length+1) + ')' + file);
                writeNewVersion(fromPath,toPath,fileData);
            } else {
                overwritePreviousVersions(dirPath,versions,file,fileData);
            }
        });
    });
}

module.exports = {
    savePreviousVersions:savePreviousVersions,
    getCurrentVersionFileData:getCurrentVersionFileData
}
