The code allows the user to ignore specified files in the syncing process.


1. Created a loop in the ignore function to obtain an array of files to ignore instead of calling the function multiple
times.

2. In order to keep track of the ignored files, I created a directory handler to print out all files in client/server folder
to display the content of the folders.

3. Instead of checking to see if the file name is part of fromPath and toPath in the syncFile function, use dirHandler.
This prevents syncFile from accepting a file with a name containing the name of another file. This also stops the function
from accepting a directory with a name containing the name of the file.

4.