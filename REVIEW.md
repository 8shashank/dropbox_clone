# Review of Frank Cao by Jason Xiong

## Overview

This code provides configurability to a simple dropbox implementation through the use of a config file and commandline arguments for setting and getting configurations. The config file specifies what paths to watch and sync for changes, rather than having to manually add paths to the command-line arguments every time.


## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. There is a possible bug in checking for existing configurations during function checkForChanges(). JavaScript generally requires checking for both undefined and null for object existence.
1. There is a bug in the boundary condition checking in the manifold handler. This refactoring describes the issue in detail and provides a proposed fix.
https://github.com/cs4278-2015/assignment2-handin/pull/2
