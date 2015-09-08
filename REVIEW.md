Review by Tazrian Haider Rafi:
1. Moved the additional package dependencies of express and formidable to package.json so that they will be installed automatically when installed globally.
2. Changed the location where the commentlog file is created, since the function has issues creating a new directory. Creating the file in the root directory gets rid of this issue.
3. Added some code to sync-server to automatically load the GUIServer. This gets rid of the step to run the GUIServer separately.
4. Added console message to signify that the GUIserver is running.
5. removed the duplicate console message, and created one string that is passed to both console and buffer instead.

General comments:
Pretty solid use case. I would use something like bootstrap to make the website look prettier and more standard and easy to maintain. I would also add some usage logs to show what a user was trying to do when they sent the comment.