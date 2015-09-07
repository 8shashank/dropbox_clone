var fs = require('fs');
var fsutils = require("./fsutils");
var _ = require('lodash');
var uris = require("./dropboxuris");
var base64util = require("./base64utils");

var Pipeline = require("./pipeline").Pipeline;

// localFs now is a copy of server defined in sync-server.js
var localFs = {
    list:function(path,cb){
        path = uris.getPath(path);
        cb(fs.readdirSync(path));
    },
    stat:function(path,cb){
        path = uris.getPath(path);
        var state = fs.statSync(path);
        
        // Below is a workaround to a bug that I have not solved.
        // Without manually build a "result", call isDirectory() on state will give undefined is not a function.
        var result = {
            "isDirectory":(state.isDirectory()? true:false),
            "ctime" : (state.ctime? state.ctime.getTime():-1),
            "size" : (state.size? state.size : -1)
        };

        cb(result);
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

var getHandler = function(path){
    var proto = uris.getProtocol(path);
    return fsHandlers[proto];
}

var removeFile = function(path){
    fs.unlink(path, function(err){
        if(err)
        {
            throw "Failed to remove the file at "+path;
        }
        console.log("Removed file at "+path);
    });
}

var syncItem = function(fromPath,toPath){
    var srcHandler = getHandler(fromPath);
    var trgHandler = getHandler(toPath);

    srcHandler.readFile(fromPath,function(base64Data){
        trgHandler.writeFile(toPath,base64Data,function(){
            console.log("Copied "+fromPath+" to "+toPath);
        })
    });

}

var writePipeline = new Pipeline();

writePipeline.addAction({
    exec:function(data){
        _.each(data.removeFiles, removeFile);
        return data;
    }
});

writePipeline.addAction({
    exec:function(data){
        _.each(data.removeFolders, fsutils.removeDirectory);
        return data;
    }
});

writePipeline.addAction({
    exec:function(data){
        _.each(data.addFolders, fsutils.createDirectory);
        return data;
    }
});

writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToSrc, function(toSrc){
            var fromPath = data.trgPath + "/" + toSrc;
            var toPath = data.srcPath + "/" + toSrc;
            syncItem(fromPath,toPath);
        });
        return data;
    }
});

writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToTrg, function(toTrg){
            var fromPath = data.srcPath + "/" + toTrg;
            var toPath = data.trgPath + "/" + toTrg;
            syncItem(fromPath,toPath);
        });
        return data;
    }
});

var update = function(data){
    console.log("Update");
    console.log(JSON.stringify(data));
    writePipeline.exec(data);
}

module.exports = {
    update : update,
    fsHandlers : fsHandlers,
    getHandler : getHandler
}
