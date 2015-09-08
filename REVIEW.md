# Review of Phil Hawkins by Grayson Brewer

## Overview

In addition to the the basic directory sync application, a "timestamping" feature has been added. When files are synced, the current time is recorded and logged in the console. This was implemented with a variable "promptedUpdate" that controls when the user gets instructions to input a command, by logging the full date and time in the syncFile method, and a nested if statement in getUserInput that manages the promptedUpdate variable and continues the user input process. The result is that when a file is synced, the statement "changes detected! directiories were synced on mm/dd/yyyy at hh:mm:ss."

## Suggested Reading Materials

none come to mind.

## Suggested Improvements


1. The date-generating portion of the the code could be factored out into a timeStamp method

2. The third portion of the if statement nested within if(promptedUpdate) could either be removed or made more descriptive. An instance where the operation does not match any of the possible options is already covered at the end of getUserInput(), so if that bit of code is reached it will either double log that issue, or it tells you that promptedUpdate was true and that should only happen for two cases and maybe even that the operation was recognized later but promptedUpdate should have been false. So changing the comment to say something like "case with this operation where 'promptedUpdate == true' was not accounted for" or something along those lines might be more useful for debugging, especially in a bigger project.

3. This might be wrong but I might actually call timeStamp() after the other console log describing the path so it makes more sense and the timestamp is actually made once the process has been completed.

4. Despite this being a very small project, I would try to do more commits in the future so you can explain more fully what each of the 3 pieces of code does. 

5. You might remove your commented out debugging statements to make the code look a little less busy, and leave some white space for the reader. 