# Review of Grayson Brewer by Eric Yang 

## Overview

Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.

The overall functionality implemented was to allow for files to never be synced. The architecture of the code consisted of first marking files as active or ignored through argv. This allowed for filess to have an indicator of whether to sync to not to sync. An array was created and files that were to be ignored were added to the array. The array was then passed into the sync.compare function in index.js. Another function was created in sync.js to check whether a file should be ignored in the sync process through the use of name comparisons with the array. A boolean check was then put in place in the compareDirectoriesOneWay function in order to check if a file name was to not be synced and not add it to an array for copying. This allowed for the directories and its files marked as ignored to not be synced. By creating an array of file names to not be synced, checking for file names in the array in the comparison functions allowed for easy implementation for files/directories to not be synced.


## Suggested Improvements

Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).

1. In fileNotIgnored function in 'sync.js', the comparision should use === instead of == as === also checks if the types are the same instead of doing type conversion.
2. The function syncIsActive in 'index.js' can be implemented further with user input and ask the user if they want sync to be active. A possible implementation is located in 'fix.js'
3. I think instead of hardcoding the 'ingoreOptionArgs' with only allowing 3 files to only be ignored, you could ask the user which files they don't want to sync, keep track of those in a file somewhere. This allows for many files to be ignored.
4. In 'fileNotIgnored' function in 'sync.js' instead of using the for loop each time you want to check a filename to see if it's in the array, use the indexOf function for arrays. I think this is more efficient than using the for loop each time. Possible implementation in 'fix.js'.
5. Perhaps instead of passing the list through several different functions, you could perform your check of the fileNotIgnored in the index.js before the syncFile function is called in the writePipeline section. 

