# Review of Tristan Kindig by Lawrence Waller

## Overview

This code serves to implement a basic dropbox server and client. The server and client, written in Node.js, work together
to synchronize files between two folders. This particular version attempts to add a username functionality to provide
some security to dropbox operations.

## Suggested Reading Materials

Tristan, you seem to have done a lot of heavy modification to the source code. I would take a good look at these
two articles about pattern-oriented software development to see why Professor White wrote those sections of code
the way that he did...
https://en.wikipedia.org/wiki/Interpreter_pattern
https://en.wikipedia.org/wiki/Command_pattern

## Suggested Improvements

1. One of the requirements of this assignment is that you not alter your legacy code base, no matter how "flawed" you
find it. I went through and restored some of the deletions that you made, and I suggest that you start from there
towards trying to 'set things right'.

2. You are not the first person whose assignment did not immediately run because of package.json difficulties. I made an
edit to that, but I am not sure if it is exactly the right fix to your problem. Alternatively, just run sudo npm install.
(But of course, you don't want your client to have to check their dependencies every time they load up your code)

3. Your "username" implementation is not working because of an odd bug; I suggested some places where you might start to
try and track that down.

4. Honestly, I can't suggest a whole lot more because your code wasn't working and didn't really implement anything new.

5. <repeat #4>