/**
 * Created by Grayson on 9/8/2015.
 */


var syncFile = function(fromPath,toPath) {
    var srcHandler = sync.getHandler(fromPath);
    var trgHandler = sync.getHandler(toPath);

    srcHandler.readFile(fromPath,function(base64Data){
        trgHandler.writeFile(toPath,base64Data,function(){
            console.log("Copied "+fromPath+" to "+toPath);
            timeStamp();
        })
    });

}

function timeStamp() {
    var time = new Date();
    console.log("change detected! directories were synced on " + time.getMonth() + "/" + time.getDay() + "/"  +
        time.getFullYear() + " at " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
}


if (promptedUpdate) {
    if (operation == 'update') {
        return;
    } else if (operation == 'exit') {
        promptedUpdate = false;
        return;
    } else {
        console.log("case with this operation where 'promptedUpdate == true' was not accounted for");
    }
}
