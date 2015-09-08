# Review of Jacob Ho (youngho) by Connor McGowan

## Overview

This code adds the ability to exclude files in the synced directories from the synchronization process. Before syncing files, a .ignore file in the synced directory is checked. Any file names that are listed in the file will not be written to during the sync. The .ignore file is formatted so each filename is followed by a newline character "\n".

## Suggested Reading Materials

None

## Suggested Improvements

1. The ignore functionality should be moved out of the handler list function. This function was supplied in the legacy code, so other working changes may depend on its given functionality. Baking the ignore process into it breaks the previous API guarantees. Make the call in the client-sde code (index.js) instead.
2. The lodash package includes a difference() function that performs the same logic found in the loop in ignoreFiles(). Replace the existing loop with it to reduce code size and improve readability.
3. Our code should be async as possible when doing I/O. ignoreFiles() can be made async by using the async function fs.readFile() and returning the result through nested callbacks (continuation passing).
4. The .ignore path could be made a global variable, in case the module is ever expanded past the current function. Future additions would also need to access the same file.
5. The comment for ignoreFiles() assumes that it will only be used for syncing. Since it only removes file names from an array, it could possibly be used in other extensions beyond just syncing, so the comment should be a more general description of its functionality.
6. The module assumes .ignore has been created in both directories. There should be error checking for that assumption, as reading a non-existant file gives an error. The check can also be smart and initialize the file if the given error is ENOENT (entity doesn't exist).


# Review of \<firstname\> \<lastname\> by \<your\_first\_name\> \<your\_last\_name\> 

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

This module uses a ".ignore" file that lists files to not sync. It reads that file and removes the listed files from the given file list.

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. Printing the files that are being synced every second can get overwhelming for the user.
2. Change the for-in to a regular for loop in the ignoreFiles method in ignore.js. The for-in should be used to iterate through properties of an object, not through elements of an array.
3. Ignoring files wasn't working (at least for Windows) because there were extra non-ASCII characters at the end of each file name in the .ignore file. I performed a .trim() on each element in the filesToIgnore array in the ignoreFiles method in ignore.js.
4. Changed the ignoreFiles method to use a callback instead of return a value.
5. Separate the getting the list of files to ignore to its own method.
=
See commits in https://github.com/cs4278-2015/assignment2-handin/pull/29
