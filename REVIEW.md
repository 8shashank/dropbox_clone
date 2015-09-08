# Review of Jon Lee by Chris Lee 

## Overview

This code implements a file log for the Dropbox application. The code is easily mergeable because it is simply adding a function and function call. The function tracks the time, the date, and the path of that change and puts it into a log file that is stored in a records folder in the folder of execution of the program. 


## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. There is a bug in the boundary condition checking in the manifold handler. This refactoring describes the issue in detail and provides a proposed fix.
https://github.com/cs4278-2015/assignment2-handin/pull/2
