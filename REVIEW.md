# Review of Emma Birdsong by Jonathan Schenker

## Overview

This feature modifies the dropbox server to be publicly available on port 8000, and prints a shareable link to the console when updating a file. The sync-server.js has been modified to listen on port 8000, and log to the console information about requests. The index.js file has been modified to log the web link for any modified file.

A minimal 404 page will be generated if an invalid path is given, and propper return codes (200 or 404) will be given to requests depending on the success of the file request.

No unit tests were created to check the functionality of the feature. 

## Suggested Improvements

1. Currently non functional because of git errors, fixed those.

2. This allows files not in the dropbox folders to be opened if someone knows the path, this could be changed by requiring a specific url path.

3. Allow the user to assign the port to be used with console input.

