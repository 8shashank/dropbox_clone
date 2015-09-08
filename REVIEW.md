#Review of Parker Klein by Jonathan Clinton

##Overview

    Uses Collin's code to build an add file function which uses the code base's built in writeFile functions
    to write out a new file to both directories.

## Commit 1 - Made a couple of dnode/weak changes to make it runnable on my machine

    Self Explanatory

## Commit 2 - Bug fix : writing twice to path 1

    It now correctly writes to path 1 and 2 instead of writing to path 1 twice and then letting
    it sync to path 2 as normal.

## Commit 3 - Reduced code duplication

    Pulled handler setup code out into a separate function for add and delete functions.
    Would love to make it take a function pointer/delegate instead of a string and switch statement but
    I have no idea how to do that in javascript.

## Commit 4 - Improved update formatting

    Used Date.toTimeStamp() to more cleanly get the Hours, minutes, and seconds for the user. This also
    fixes the slight bug where leading zeros were getting dropped. Ex: 1:03 being 1:3.

## Commit 5 - Making update correct across runnings of the program

    It might be good to have it loop over all the files in the directories checking time stamps
    and just return the most recent as the most recently edited. I am not sure exactly how to do
    that though but I would assume that it shouldn't be too difficult for someone more
    competent than I am at javascript.