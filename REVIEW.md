# Review of Lawrence Waller by Collin Jackson

## Overview

No changes were made to the existing code. The additions consist of a simple webpage that takes user input and a server that handles the input. Communication between the server and webpage is handled via POST.

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*
1. Change the location of `commentlog.txt`. If the directory `ClientMessageLog` does not exist, attempting to open the file results in an error.
