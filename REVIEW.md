# Review of Shashank Sharma by Baihua Xuan 

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

The added feature allows the user to specify a list of file names to be ignored when during the sync. The list of file names are provided in a file named **_.dropboxignore** that is put in the directory in which the files to be ignored are located.

The goal is accomplished by intercepting the **files** object in the callback function passed into the handler's **list** function, and removing file names from it which are specified in the **_.dropboxignore** file, if any. By doing this, the **directoryInfo** passed back to **captureDirectoryState** will not include those files and they will not be picked up during sync'ing.

## Suggested Reading Materials

*Optionally, provide links to any reading materials that you believe would be beneficial to the reviewee.*

No reading materials are suggested.

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. There is a bug that whenever a file name is included in the **_.dropboxignore** file, it will not be included in the list of files returned by the handler function **list**, thus avoiding its contents to be sync'ed to the remote. However, it will appear to the remote that there is a missing file in the local and the remote will try to sync the file to the local directory. But even after the file is copied over, it will not appear the next time **list** is called on the local directory and thus the remote will continuously try to sync the file to the local directory.
Suggested fix: Even if we do not want any modifications of the local file to be sync'ed to the remote, we still cannot modify the local file because whenever we do so, the remote version would be sync'ed to the local, covering the modifications. We might as well balk the sync from the remote to the local then. In order to do this, we could opt to not ignore the **_.dropboxignore** from the directory so that this file will be in sync for both sides, so that whenever one side decides to modify **_.dropboxignroe** to ignore some files, the same files will be ignored on both sides thus blocking the sync on the same files in both directions.

