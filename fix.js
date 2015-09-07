var readline = require('readline');


// sample user input for seeing if they want sync active or not, not sure if it totally works,
// but you get the idea.
function syncIsActive() {
    console.log("Would you like sync active? (yes|no) ");

    var r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    r1.prompt();
    r1.on('line', function (line) {
        if(line === "yes"){
            r1.close();
            return true;
        }
        else if (line === "2"){
            r1.close()
            return false;
        }
        else{
            r1.close();
            console.log("Entered in unknown option.");
        }

    })

}


// controls if statement that keeps files from being queued for sync in compareDirectoriesOneWay
// This function returns true if name is not located in ignoredFiles, and false if name is found in ignoredFiles
function fileNotIgnored(name, ignoredFiles) {
    if(ignoredFiles.indexOf(name) === -1){
        return true;
    }
    else{
        return false;
    }
}