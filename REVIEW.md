# Review of \<firstname\> \<lastname\> by \<your\_first\_name\> \<your\_last\_name\> 

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

This code adds to the syncFile function. The added feature keeps a log of what files are being changed. When files have changed, the user is then prompted to type in a username that is then stored in the log file as well. The log file is written in the SyncFile function and more specifically, written in the srcHandler.readFile function. 

## Suggested Reading Materials
No suggested readings. 

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. Cleaned up and deleted commented out and unused code. https://github.com/cs4278-2015/assignment2-handin/pull/18
2. Created a seperate function to write to file. Allows better readability and organization.  
3. throw error and if statement can be on the same line to save space. 
4. moved the instantiation of r1 (readline.createInterface function) inside the writeToLog function 
5. changed '/n' to to '/r/n/' so new line can work on window machines 

