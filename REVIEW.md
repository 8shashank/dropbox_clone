# Review of Jon Lee by Parker Klein

## Overview

Writes to a log file every time the files are synced. Keeps track of which file was changed and when the file was changed. Can easily look back at the log file to see when all changes were made. It uses a function that is called that will then check to make sure if a folder exists and then adds a string to the log file.

## Suggested Improvements

1. Changed to log the file path that is actually being updated

2. Should not log that the change has occurred until the change has occurred

3. renamed variables for better meaning

4. Reduced the number of lines of code by removing some variables

5. Removed the second instance of requiring in the fs module
