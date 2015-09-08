# Review of Doug Lisk by AJ Ballway

## Overview

This code checks the filetype whenever looking at a file, and if it is an mp3, the code makes a call to the echonest server to get information about the song and then logs the response to STDOUT

## Suggested Reading Materials

*Optionally, provide links to any reading materials that you believe would be beneficial to the reviewee.*

N/A

## Suggested Improvements

1. Added echojs to package.json for portability
2. Removed IDE data directory and updated .gitignore to prevent it from being added in the future
3. Added error handling to echo post call
4. Factored out echo call to helper method
5. Added more logging to error on echo call and changed echo apikey to a valid value
