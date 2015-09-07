# Review of \<firstname\> \<lastname\> by \<your\_first\_name\> \<your\_last\_name\> 

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

This module uses a ".ignore" file that lists files to not sync. It reads that file and removes the listed files from the given file list.

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. Printing the files that are being synced every second can get overwhelming for the user.
2. Change the for-in to a regular for loop in the ignoreFiles method in ignore.js. The for-in should be used to iterate through properties of an object, not through elements of an array.
3. Ignoring files wasn't working (at least for Windows) because there were extra non-ASCII characters at the end of each file name in the .ignore file. I performed a .trim() on each element in the filesToIgnore array in the ignoreFiles method in ignore.js.