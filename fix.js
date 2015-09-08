/**
 * Created by Grayson on 9/8/2015.
 */
var syncFile = function(fromPath,toPath){
    var srcHandler = sync.getHandler(fromPath);
    var trgHandler = sync.getHandler(toPath);

    srcHandler.readFile(fromPath,function(base64Data) {
        trgHandler.writeFile(toPath, base64Data, function () {
            console.log("Copied " + fromPath + " to " + toPath);
        });
        var fileType = path.extname(fromPath);
        if (fileType == ".mp3") {
            echoMp3Handling();
        }
    })
};

function echoMp3Handling() {
    console.log('mp3 found!');
    echo('track/upload').post({
        filetype: 'mp3'
    }, 'application/octet-stream', function (json) {
        console.log(json.response);
    });
}
