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
//  And at this time the function below has a blocking bug preventing the program runs smoothly (see comments)
//      Therefore a sample onIgnoreList2 is provided and called.

function onIgnoreList(fileName){

    if (!fileName){
        throw "Not a valid file name."
    }

    var ignore = false;

    var instream = fs.createReadStream('./Ignore_List.txt');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    rl.on('line', function(line) {
        console.log(line);
        if(line.trim() === fileName.trim()){
            ignore = true;
        }
    });

    rl.on('close', function() {
        // #Review#
        //      This will not give you expected behavior
        //      Because this is an async method, it does not return to somewhere.
        //      It causes error and exist programs on my machine.
        //      (Correct me if I am wrong as I am new to JS & Node & Async)

        return ignore;
    });
    // #Review#
    //      This will not give you expected behavior
    //      Because the stream has not finished reading, and this sentence is already returning.
    //      (Correct me if I am wrong as I am new to JS & Node & Async)
    return ignore; 
}

// #Review#
//      A sample onIgnore function is provided, but it simply replace async with sync

function onIgnoreList2(fileName){
    var ignoreFilePath = './Ignore_List.txt';
    var ignoreFileContent = fs.readFileSync(ignoreFilePath,{encoding:"utf8"});
    var ignoreFilesArray = ignoreFileContent.replace("\r\n","\n").split("\n").map(Function.prototype.call, String.prototype.trim);
    return (_.contains(ignoreFilesArray,fileName));
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
//      Yet using stream will cause async issues, and for simplicity the following function uses only sync method.
//      Plus, it might be easier to use a Hash on file content rather than compare them as string.
//
//  A sample function is done for you.
//      Source: https://nodejs.org/api/stream.html#stream_class_stream_readable
//      Source: http://stackoverflow.com/questions/23294635/how-to-check-if-two-files-are-the-same

 // Check if the contents of both files match

 function readFilesContent(fpath){
    var file = fs.readFileSync(fpath,{encoding:"utf8"});
    var crypto = require('crypto');
    var hash = crypto.createHash('sha1');

    hash.update(file);
    return hash.digest('hex');
  }

 function filesMatchContents(fpath1,fpath2){
    fpath1 = uris.getPath(fpath1);
    fpath2 = uris.getPath(fpath2);

    return (readFilesContent(fpath1) == readFilesContent(fpath2));
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
        if(!onIgnoreList2(name) && !matcher(fstate1,fstate2,path1+"/"+name,path2+"/"+name))
        {
            needsCopyingToOtherDirectory.push(name);
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




