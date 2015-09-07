# Review of Jonathan Schenker by Parker Klein

## Overview

Added a file called changelog.txt that acts as a log for activity in the test-data folders. It gets the path of the file that is being synced to and a timestamp for when the update is happening. It then uses this information in a function to append a string with details on the update to the file tracking the changelog. The design is a simple function to add to a file when updates are made. This function can be called anywhere given there was a change in the folders.

## Suggested Improvements

1. You can remove all the
