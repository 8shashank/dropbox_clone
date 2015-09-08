# Review of Eric Yang by Baihua Xuan 

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

The added feature allows user to specify a list of file names, which will not be sync'ed if they exist in either or both of the directories being monitored.
The feature is accomplished by prompting the user for file names that they do not wish to sync and then storing them in a file. And then every time before a file is sync'ed in the pipeline, it's checked to see if its name is in the list of files specified to never be sync'ed. If it is then it will be skipped.

## Suggested Reading Materials

*Optionally, provide links to any reading materials that you believe would be beneficial to the reviewee.*

No reading materials are suggested.

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. In *askUserInput*, if the user types in 1 or invalid argument, the application should not stop prompting the user from there on. The case where an invalid argument was typed in can easily be fixed by just keep prompting instead of closing the *readline* stream. The case where 1 is typed in will be elaborated upon in the next suggestion. 