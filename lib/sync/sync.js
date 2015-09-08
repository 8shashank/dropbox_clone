var fs = require('fs');
var _ = require('lodash');
var uris = require("./dropboxuris");
var base64util = require("./base64utils");
var readline = require('readline');
var stream = require('stream');

var localFs = {
    list:function(path,cb){
        path = uris.getPath(path);
        cb(fs.readdirSync(path));
    },
    stat:function(path,cb){
        path = uris.getPath(path);
        cb(fs.statSync(path));
    },
    writeFile: function(path,base64data,cb){
        path = uris.getPath(path);
        base64util.writeFromBase64Encoded(base64data, path);
        cb();
    },
    readFile: function(path,cb){
        path = uris.getPath(path);
        cb(base64util.readBase64Encoded(path));
    }
}

var fsHandlers = {
    file:localFs
};

function getHandler(path){
    return fsHandlers[uris.getProtocol(path)];
}

function getHandler(path){
    var proto = uris.getProtocol(path);
    return fsHandlers[proto];
}


//Check if 'fileName' is on ignore list.

// #Review#
//      Agree with the need to be up-to-date with the ignore file.
//      However the function below might be executed too many times. 
//
//      This function will be called everytime when CompareDirectoriesOneWay iterates onto a name
//      And it will read from the ignore file everytime it runs.
//      The fact is: After capture the state, we can suppose the content of ignore file will not change.
//      If the directory state is not up-to-date, there seems no need to be so up-to-date with ignore files.
//  
//      Therefore, here we might use a var ignoreFiles, an array of filenames that will be ignored.
//      And update it everytime after we capture the directory state.
//      Then in the function below we just need to check whether the file is in the array.
//

function onIgnoreList(fileName){

    if (!fileName){
        throw "Not a valid file name."
    }

    var ignore = false;

    // #Review#
    //      Maybe there is no need to use stream as we don't need to stop in the middle way of a file?
    //  
    //      A simple approaches would be
    //          ignoreFilesArray = fs.readFileSync(ignoreFilePath).replace("\r\n","\n").split("\n").map(Function.prototype.call, String.prototype.trim);
    //      And then to check whether a file should be ignored
    //          return (_.contains(ignoreFilesArray,fileName))
    //      
    //      Source: http://stackoverflow.com/questions/19293997/javascript-apply-trim-function-to-each-string-in-an-array
    //      Source: http://stackoverflow.com/questions/10864486/node-js-constant-for-platform-specific-new-line
    //      Source: https://lodash.com/docs

    var instream = fs.createReadStream('./Ignore_List.txt');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    rl.on('line', function(line) {
        if(line.trim() === fileName.trim()){
            ignore = true;
            // #Review#
            //      You can return now since you found the file should be ignored!
            //      And remember to close the stream, if you decide to use it.
        }
    });

    rl.on('close', function() {
        return ignore;
    });

    return ignore;
}


// Tried to add functionality to check if file contents were equal. Currently not working.

 // Check if the files have matching names, sizes, and contents.
 function filesMatchExactly(fstate1,fstate2,fpath1,fpath2){

     var filesMatch = filesMatchNameAndSize(fstate1,fstate2) && filesMatchContents(fpath1,fpath2);

     return filesMatch;
 }


// #Review#
//
//      If you really want to get the path, then you might pass it in the calling func.
//      Yet it's a good idea to use stream here, if you would like to read a small chunk and compare one by one.
//      Plus, it might be easier to use a Hash on file content rather than compare them as string.
//
//  A sample function is done for you.
//      Source: https://nodejs.org/api/stream.html#stream_class_stream_readable
//      Source: http://stackoverflow.com/questions/23294635/how-to-check-if-two-files-are-the-same

 // Check if the contents of both files match

 function readFilesContent(fpath,cb){
    var readStream = fs.createReadStream(fpath,{encoding:"utf8"});

    var crypto = require('crypto');
    var hash = crypto.createHash('sha1');

    readStream
      .on('data', function (chunk) {
        hash.update(chunk);
      })
      .on('end', function () {
        cb(hash.digest('hex'));
      });
  }

 function filesMatchContents(fpath1,fpath2){

    fpath1 = uris.getPath(fpath1);
    fpath2 = uris.getPath(fpath2);

    readFilesContent(fpath1,function(f1){
        readFilesContent(fpath2,function(f2){
            return (f1==f2);
        });
    });
}

function filesMatchNameAndSize(fstate1,fstate2){

    var filesMatch = filesMatchName(fstate1,fstate2) && (fstate1.size == fstate2.size);

    return filesMatch;
}

function filesMatchName(fstate1,fstate2){

    var filesMatch = (fstate2);

    return filesMatch;
}

function captureDirectoryState(directoryInfo,cb){
    var directoryState = {};

    var fileList = directoryInfo.fileList;
    var path = directoryInfo.path;

    if(fileList.length == 0){
        cb(directoryState);
    }
    else {
        var handler = getHandler(path);

        var stateCaptureCallback =function (fileName,counter){
            return function (data) {
                directoryState[fileName] = data;
                counter();
            }
        };

        var callbacks = 0;
        var counter = function(){
            callbacks++;

            if (callbacks >= fileList.length) {
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

function compareDirectoriesOneWay(state1,state2,matcher,path1,path2){
    var directoriesMatch = true;

    var needsCopyingToOtherDirectory = [];

    for(var name in state1){

        var fstate1 = state1[name];
        var fstate2 = state2[name];

        // If it's on the ignore list, jump out early so that it doesn't get synced.
        if(!onIgnoreList(name) && !matcher(fstate1,fstate2,path1,path2)) {

            var lastModified1 = (fstate1.ctime.getTime)? fstate1.ctime.getTime() : new Date(fstate1.ctime);
            var lastModified2 = (fstate2)?
                                    ((fstate2.ctime.getTime)?
                                            fstate2.ctime.getTime()
                                            : new Date(fstate2.ctime))
                                    : -1;

            if(lastModified1 > lastModified2){
                needsCopyingToOtherDirectory.push(name);
            }
        }
    }
    return needsCopyingToOtherDirectory;
}

function compare(path1,path2,matcher,cb){
    getDirectoryInfo(path1,function(directoryState1){
        getDirectoryInfo(path2,function(directoryState2){
            compareDirectories(directoryState1,directoryState2,matcher,cb);
        });
    });
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
            var syncTo2 =
                compareDirectoriesOneWay(state1,state2,matcher,path1,path2);

            var syncTo1 =
                compareDirectoriesOneWay(state2,state1,matcher,path1,path2);

            cb({
                syncToSrc:syncTo1,
                syncToTrg:syncTo2,
                directoriesMatch:function(){
                    return syncTo1.length === 0 && syncTo2.length === 0;
                }
            });
        });
    });
}

function getDirectoryInfo(path, cb){
    var handler = getHandler(path);

    handler.list(path, function(files){
        cb({
            fileList:files,
            path:path
        });
    });
}

module.exports = {
    compare:compare,
    filesMatchName:filesMatchName,
    filesMatchNameAndSize:filesMatchNameAndSize,
    fsHandlers:fsHandlers,
    filesMatchContents:filesMatchContents,
    filesMatchExactly:filesMatchExactly,
    getHandler:getHandler
}




