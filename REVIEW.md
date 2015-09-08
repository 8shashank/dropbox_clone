# Review of Eric Yang by Matthew Owens

## Overview

Eric's code includes added functionality that allows the user to choose files that they wish to not sync. It is encapsulated into several different functions, some of which handle user interactions and others which handle checking and writing to the "never sync" file. A text file, called 'neversyncfile.txt', holds all of the files which are to be ignored when syncing. The 'fs' and 'readline' libraries are used in this code as well.

## Suggested Reading Materials

None.

## Suggested Improvements

All suggested improvements can be found in this pull request: https://github.com/cs4278-2015/assignment2-handin/pull/27

1. Currently, if the user does not enter '1' or '2' when asked to choose whether to sync or to indicate files not to sync, there is no more user interactions. This refactoring (commit a337d51) describes and proposes a solution for allowing the user to re-enter his or her request.
2. Some of the variable names are general and unclear. This refactoring (commit bd083c0) provides alternate names for several of these variables.
3. One of the functions uses several if-else statements to handle user choices, which is somewhat verbose. This refactoring (commit 35ef6eb) suggests changing this code to a switch statement for clarity.
4. No message is relayed to the user when he or she decides to sync files, although there are messages for all other choices. This could lead the user to think something is wrong. This refactoring (commit 42c18c0) adds a message to be printed for the user.
5. When the user is prompted to enter a file name to put on the no-sync list, he or she can press enter and an empty string is added to the 'neversyncfile.txt' file. This refactoring (commit e70c144) includes suggests and a proposed fix for this edge case.

