var fs = require('fs');
var fsutils = require("./fsutils");
var _ = require('lodash');
var uris = require("./dropboxuris");
var base64util = require("./base64utils");
var path = require("path");

var sync = require("./sync");

function checkDirectoriesExist(path1, path2) {
    try {
        stat1 = fs.lstatSync(path1);
        stat2 = fs.lstatSync(path2);

        if (!stat1.isDirectory() || !stat2.isDirectory()) {
            console.log('One of the given directories does not exist!');
            process.exit();
        }
    }
    catch (e) {
        console.log(e);
        process.exit();
    }
}

function fileMatch(fstate1,fstate2){

    var filesMatch = (fstate1.size == fstate2.size);
    //#TODO improve the match function

    return filesMatch;
}


function compareModifiedTime(fstate1,fstate2){
    var lastModified1 = (fstate1.ctime.getTime)? fstate1.ctime.getTime() : new Date(fstate1.ctime);
    var lastModified2 = (fstate2.ctime.getTime)? fstate2.ctime.getTime() : new Date(fstate2.ctime);
    return (lastModified1 > lastModified2); // Whether 1 is newer than 2.
}


function captureDirectoryState(directoryInfo,cb){
    var directoryState = {};

    var fileList = directoryInfo.fileList;
    var path = directoryInfo.path;

    if(fileList.length == 0){
        cb(directoryState);
    }
    else {
        var handler = sync.getHandler(path);

        var stateCaptureCallback = function (fileName,counter){
            return function (state) {
                directoryState[fileName] = state;
                counter();
            }
        };

        var callbacks = 0;
        var counter = function(){
            callbacks++;

            if (callbacks >= fileList.length) {
                // #Mark# Live with Async #
                cb(directoryState);
            }
        }

        for (var i = 0; i < fileList.length; i++) {
            var fileName = fileList[i];
            var collector = stateCaptureCallback(fileName, counter);
            handler.stat(path + "/" + fileName, collector);
        }
    }
}


function mergeResult(result1, result2, reverseSrcTrgFor2){

    var result = {
        removeFiles : [],
        removeFolders : [],
        addFolders : [],
        syncToSrc : [],
        syncToTrg : []
    }

    var simpleCopy = ['removeFiles','removeFolders','addFolders'];

    if(reverseSrcTrgFor2)
    {
        result.syncToTrg = result1.syncToTrg.concat(result2.syncToSrc);
        result.syncToSrc = result1.syncToSrc.concat(result2.syncToTrg);
    }
    else
    {
        simpleCopy.push('syncToSrc','syncToTrg');
    }

    _.each(simpleCopy, function(name){
        result [name] = result1[name].concat(result2[name]);
    });

    return result;

}

function addDirectory(name,srcDir,trgDir,cb){

    var srcProtocol = uris.getProtocol(srcDir);
    srcDir = uris.getPath(srcDir);

    var trgProtocol = uris.getProtocol(trgDir);
    trgDir = uris.getPath(trgDir);

    var dirPath = srcDir + "/" + name;
    var ignoreLen = srcDir.length;
    var folders = [];
    var files = [];

    var addToFolders = function(dPath){
        dPath = trgProtocol+"://"+trgDir+dPath.substr(ignoreLen);
        folders.push(dPath);
    }
    var addToFiles = function(fPath){
        fPath = fPath.substr(ignoreLen);
        files.push(fPath);
    }

    fsutils.iterateDirectory(srcDir+"/"+name, addToFiles, addToFolders);

    cb(folders,files);

}

function compareDirectoriesOneWay(state1,state2,matcher,path1,path2,compareBidirection,cb){

    var result = {
        removeFiles : [],
        removeFolders : [],
        addFolders : [],
        syncToSrc : [],
        syncToTrg : []
    }

    for(var name in state1){

        if(!compareBidirection && state2[name]) continue;

        var fstate1 = state1[name];
        var fstate2 = state2[name];

        var pos1 = path1+"/"+name;
        var pos2 = path2+"/"+name;

        if(fstate1.isDirectory)
        {
            if(!fstate2)
            {
                addDirectory(name,path1,path2,function(folders, files){
                    result.addFolders = result.addFolders.concat(folders);
                    result.syncToTrg = result.syncToTrg.concat(files);
                });
            }
            else if(fstate2.isFile)
            {
                var syncDirection = compareModifiedTime(fstate1,fstate2);
                if(syncDirection){
                    result.removeFiles.push(pos2);
                    addDirectory(name,path1,path2,function(folders, files){
                        result.addFolders = result.addFolders.concat(folders);
                        result.syncToTrg = result.syncToTrg.concat(files);
                    });
                }
                else{
                    result.removeFolders.push(pos1);
                    result.syncToSrc.push(name);
                }
            }
            else{
                var subd = name;
                compare(pos1,pos2,matcher,function(rslt){

                    rslt.syncToTrg = rslt.syncToTrg.map(function (i){
                        return subd+'/' + i;
                    });
                    rslt.syncToSrc = rslt.syncToSrc.map(function (i){
                        return subd+'/' + i;
                    });

                    cb(rslt);
                });
            }
        }
        else
        {
            if(!fstate2)
            {
                result.syncToTrg.push(name);
            }
            else if(fstate2.isDirectory)
            {
                var syncDirection = compareModifiedTime(fstate1,fstate2);
                if(syncDirection){
                    result.removeFolders.push(pos2);
                    result.syncToTrg.push(name);
                }
                else{
                    result.removeFiles.push(pos1);
                    addDirectory(name,path2,path1,function(folders, files){
                        result.addFolders = result.addFolders.concat(folders);
                        result.syncToSrc = result.syncToSrc.concat(files);
                    });
                }
            }
            else{
                if(!matcher(fstate1,fstate2))
                {
                    var syncDirection = (compareModifiedTime(fstate1,fstate2)? "syncToTrg":"syncToSrc");
                    result[syncDirection].push(name);
                }
            }
        }

    }
    return result;
}

function compareDirectories(directoryInfo1, directoryInfo2, matcher, cb){

    var fileList1 = directoryInfo1.fileList;
    var fileList2 = directoryInfo2.fileList;

    var path1 = directoryInfo1.path;
    var path2 = directoryInfo2.path;

    if(!fileList1 || !fileList2) {
        throw "An invalid directory info object was passed to the compare " +
        "directories method that had a null or " +
        "undefined file list.";
    }

    if(!path1 || !path2){
        throw "An invalid directory info object was passed to the compareDirectories" +
        "method that did not provide a path";
    }

    captureDirectoryState(directoryInfo1,function(state1){
        captureDirectoryState(directoryInfo2,function(state2){

            var result1 = compareDirectoriesOneWay(state1, state2, matcher, path1, path2, true, cb);
            var result2 = compareDirectoriesOneWay(state2, state1, matcher, path2, path1, false, cb);

            var result = mergeResult(result1, result2, true);

            cb(result);
        });
    });
}

function getDirectoryInfo(path, cb){
    var handler = sync.getHandler(path);
    handler.list(path, function(files){
        cb({
            fileList:files,
            path:path
        });
    });
}

function compare(path1,path2,matcher,cb){
    checkDirectoriesExist(path1, path2);

    getDirectoryInfo(path1,function(directoryInfo1){
        getDirectoryInfo(path2,function(directoryInfo2){
            compareDirectories(directoryInfo1,directoryInfo2,matcher,cb);
        });
    });
}

module.exports = {
    compare:compare,
    fileMatch:fileMatch
}




