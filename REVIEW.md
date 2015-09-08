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

See commits in https://github.com/cs4278-2015/assignment2-handin/pull/29
