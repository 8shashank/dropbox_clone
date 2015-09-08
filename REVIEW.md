# Review of AJ Ballway by Connor McGowan

## Overview

This code replaces the timed repeating check for changes with a watcher object. The watcher is notified when a change is made in the client directory and in turn triggers the synchronizaton process. This method improves the efficiency of the code, as checks are no longer made when the two directories already match.

## Suggested Reading Materials

None

## Suggested Improvements

1. The code has its own check to determine the protocol of the given directory arguments. These checks can be replaced by the existing getProto() function in the Dropbox URIs file.
See the first commit in https://github.com/cs4278-2015/assignment2-handin/pull/20
2. As with #1, the logic for getting the path of the directory arguments can be replaced by the getPath() function in the Dropbox URIs file.
See the second commit in https://github.com/cs4278-2015/assignment2-handin/pull/20
3. The watcher creation code has redundancy and can be refactored into a single function.
See the third commit in https://github.com/cs4278-2015/assignment2-handin/pull/20
4. Logging the watcher events can be improved by enumerating the possible events and displaying more specific notifications.
See the fourth commit in https://github.com/cs4278-2015/assignment2-handin/pull/20
5. The code is set up to only watch the client directory. However, the synchronization process also copies files from the server to the client, so the server directory should be watched as well. This can be achieved by refactoring watcher creation into the local and remote handlers, so that a watcher can be created on the server and propogate a callback to the client through the dnode connection when an event is detected.
See the final commit in https://github.com/cs4278-2015/assignment2-handin/pull/20