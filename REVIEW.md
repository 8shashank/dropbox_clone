# Review of Jon Lee by Chris Lee 

## Overview

This code implements a file log for the Dropbox application. The code is easily mergeable because it is simply adding a function and function call. The function tracks the time, the date, and the path of that change and puts it into a log file that is stored in a records folder in the folder of execution of the program. 


## Suggested Improvements

1. Writing to the log should be done after the files copied over is completed. Or writing "attempting to X change" and then have a completed one.
2. Make sure the there is a "record" (or element) that is being modified and check if it's not null
3. Changed naming to clarify variables use.
4. Would be cool to implement edge cases for when the program isn't launched in the same folder/having multiple logs/having different log names