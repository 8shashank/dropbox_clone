# Review of nicolaskline by jonlee 

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

This code adds to the syncFile function. The added feature keeps a log of what files are being changed. When files have changed, the user is then prompted to type in a username that is then stored in the log file as well. The log file is written in the SyncFile function and more specifically, written in the srcHandler.readFile function. 

## Suggested Reading Materials
No suggested readings. 

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. Add the folder1 and folder2 into folder 'test-data' because they were missing in your submission branch 
2. Improved directions to delete a file so they are less confusing.
3. Removed operations that were unnecessary. Such as 'test' and 'function.' It looks like they were used for testing. 
4. Used JavaScript Array indexOf() Method to reduce code instead of using a for loop 
5. Check to see if folders are empty or not before searching through them. It will reduce time. 
