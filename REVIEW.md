# Review of Jonathan Schenker by Parker Klein

## Overview

Added a file called changelog.txt that acts as a log for activity in the test-data folders. It gets the path of the file that is being synced to and a timestamp for when the update is happening. It then uses this information in a function to append a string with details on the update to the file tracking the changelog. The design is a simple function to add to a file when updates are made. This function can be called anywhere given there was a change in the folders.

## Suggested Improvements

1. It should be loggin the path of the file that is being updated to the updated log

2. Only the path of the file being changed is passed to the function. Timestamp is handled by the function being called

3. Format the date and time being logged

4. Remove all the .idea files

5. Added comments for better understanding and helped make the function name more understandable
