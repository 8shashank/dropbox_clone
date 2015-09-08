Review of Lawrence Waller by Tazrian Rafi

The Dropbox server accepts connections over a socket and allows clients to read the list of any files within its root (or possibly outside), get stats about those files, and read or write to those files. The client connects and continually checks the two folders for changes and then copies over any changes from one folder that are needed in the other. If the folder passed as a command line argument starts with "dnode://", then the client uses the server to obtain information about that folder. If the folder starts with "file://", then the client uses local file operations to read/sync the directory.

Lawrence added a Web GUI that clients can use to send comments or questions to the operator of the server.This can be done by starting a GUIServer and then going to 127.0.0.1:8080/basicweb.html, which takes the user to a basic form. The user can fill out some basic information and submit them using a post http request. The information is saved to a commentlog.txt file. 


Review by Tazrian Haider Rafi:
1. Moved the additional package dependencies of express and formidable to package.json so that they will be installed automatically when installed globally.
2. Changed the location where the commentlog file is created, since the function has issues creating a new directory. Creating the file in the root directory gets rid of this issue.
3. Added some code to sync-server to automatically load the GUIServer. This gets rid of the step to run the GUIServer separately.
4. Added console message to signify that the GUIserver is running.
5. removed the duplicate console message, and created one string that is passed to both console and buffer instead.

General comments:
Pretty solid use case. I would use something like bootstrap to make the website look prettier and more standard and easy to maintain. I would also add some usage logs to show what a user was trying to do when they sent the comment.

Suggested reading material:
1. Bootstrap documentation: https://bootstrapdocs.com/v3.3.5/docs/css/
