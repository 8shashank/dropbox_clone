*Review of anthonylew by nicksparkman*

Overview:

This project adds a number of features and a huge amount of code to the dropbox implementation we were given:

The developer added a file delete function to the implementation. In the index.js file, the developer created a delete function that he then utilized in the sync files to add extensibility to the interaction between server and client.

There is an excellent implementation of an emailer as well. The emailer uses outside modules nodemailer and validator to, upon call from a function in the index.js file, send the list of changed files to an outside email address. 





Suggested Reading: none 




Potential improvements:
1. Fix bug in expect.js (bug assigns a variable to itself).
2. Consider making a helper function to reduce some slight near-repetition. 
3. Enable NodeJS Globals in order to fix a resolving issue with the require() function.
4. Reword a log statement.
5. Rename variable 'now' to 'today' in order to be parallel with variable 'yesterday.'

All of the above available at https://github.com/cs4278-2015/assignment2-handin/pull/49. 
