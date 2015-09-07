var fs = require('fs');
var _ = require('lodash');
var sync = require('../sync/sync');
var uris = require('../sync/dropboxuris');

var VERSION_DIR = '.prev_versions';
var VERSION_REGEX_STRING = '\\(ver[0-9]+\\)';

function writeNewVersion(fromPath,toPath,base64Data){
    var handler = sync.getHandler(fromPath);
    handler.writeFile(toPath,base64Data,function(){
        console.log('Saved ' + fromPath + ' as previous file version ' + toPath);
    });
}

function overwrite(fromPath,toPath,base64Data){
    var handler = sync.getHandler(fromPath);
    handler.writeFile(toPath,base64Data,function(){
        console.log('Previous file version ' + toPath + ' overwritten by ' + fromPath);
    });
}

function overwritePreviousVersions (dirPath,versions,newFile,newFileData){
    var versionDirPath = dirPath + '/' + VERSION_DIR;

    getCurrentVersionFileData(versionDirPath,versions,function(versionData){
        for (var i = 1; i < versions.length; i++) {
            var fromPath = versionDirPath + '/' + versions[i];
            var toPath = versionDirPath + '/' + versions[i-1];
            var overwriteData = versionData[versions[i]];
            overwrite(fromPath,toPath,overwriteData);
        }

        fromPath = dirPath + '/' + newFile;
        toPath = versionDirPath + '/' + versions[version.length-1];
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
            var path = dirPath + '/' + file;
            var collector = fileReadCallback(file,counter);
            handler.readFile(path,collector);
        });
    }

}

function getPreviousVersions(path,filesToCheck,cb) {
    try{
        if(!fs.existsSync(uris.getPath(path))){
            fs.mkdirSync(uris.getPath(path));
        }
    } catch(e){
        if (e.code != 'EEXIST') {
            throw e;
        } else {
            console.log('Caught EEXIST when trying to create a directory. This should not happen outside of dangerous race conditions!');
        }
    }
    sync.getDirectoryInfo(path,function(directoryInfo){
        var fileList = directoryInfo.fileList;
        var matchingFiles = {};
        _.each(filesToCheck,function(file) {
            matchingFiles[file] = [];
            var regexStr = VERSION_REGEX_STRING + _.escapeRegExp(file);
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
    var versionDirPath = dirPath + '/' + VERSION_DIR;

    getPreviousVersions(versionDirPath,files,function(allVersions){
        _.each(files,function(file){
            var versions = allVersions[file];
            var fileData = dataFiles[file];
            if (versions.length < maxVersions) {
                var fromPath = dirPath + '/' + file;
                var toPath = versionDirPath + '/(ver' + (versions.length+1) + ')' + file;
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
