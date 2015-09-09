#Review of Nicolas Kline by Taylor Zhang

##Overview
Nicolas Kline takes the Command Line Interface provided by another studnent and implements a delete function. When called, both files in the 
predetermined dropbox folder will be deleted. Nicholas does this by implementing a deleteFile function in index.js. It takes a filename, checks
if the file name is in both appropriate directories through a function called listSearch, and only deletes the file if all the above are satisfied.
List search gets all file names from a directory and iterates through these file names to see if one matches the parameter.


##Suggested Improvements

1. Bugfix: The CLI automatically removes spaces in line 175 in index.js, making it impossible to delete files with spaces in the name.
I suggest fixing this by adding more logic to the getUserInput() function. Check if the operation == 'delete' and check if there are 
more than 2 elements in the 'args' array. If those conditions are met,

2. Suggested Improvement: Delete more than one document at once

3. Suggested Improvement: Before anything else in the Deletefile function, check if there are any files in the folder at all for more efficiency.

4. Suggested Improvement: When something has been succesfully deleted, console.log("Deleting file") isused to indicate success.
This is inacurrate and potentially confusing, and should be changed to something more accurate, like console.log("File Successfully Deleted")

5. Suggested Improvement: Implement a "Are you sure you want to delete?" function to ensure correct behavior for the user.


