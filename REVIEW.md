*Review of tristankindig by nicksparkman*

Overview: This project implements a functionality that asks users to input a user ID name and appends a statement to the DirectoryModifications text document logging what user modified what directory. Inclusion of an outside module, readLine, was necessary for this implementation. Once this module was included, the developer set up an interface between standard input and output in order to allow for document modification based on user input. At that point it was a matter of modifying the syncFile function in order to add the functionality.


Suggested Reading: none


Potential improvements for the code:
1. Fix bug in expect.js in which a variable is assigned to itself.
2. Enable NodeJS Globals in order to fix some issues related to unresolved functions.
3. Refactor an error logging statement.
4. Consider the edge condition of blank input for the username and modify the code to account for such a condition.
5. Reword a query for input. 

All changes mentioned above can be found at https://github.com/cs4278-2015/assignment2-handin/pull/54. 
