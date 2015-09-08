/**
 * Created by Grayson on 9/8/2015.
 */


var syncFile = function(fromPath,toPath) {
    var srcHandler = sync.getHandler(fromPath);
    var trgHandler = sync.getHandler(toPath);

    srcHandler.readFile(fromPath,function(base64Data){
        trgHandler.writeFile(toPath,base64Data,function(){
            console.log("Copied "+fromPath+" to "+toPath);
        })
    });

}

function timeStamp() {
    //promptedUpdate = true;
    var time = new Date();
    console.log("change detected! directories were synced on " + time.getMonth() + "/" + time.getDay() + "/"  +
        time.getFullYear() + " at " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
    //getUserInput();
}