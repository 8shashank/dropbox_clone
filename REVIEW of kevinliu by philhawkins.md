This code uses the majority of what was provided for us to implement the dropbox-style service. This code actually 
streamlines a lot of the process; removing code from the original that may not have been necessary to compete the 
job. With minimal testing, this streamlining process appeared successful, appropriately keeping the two directories
in question in sync and up to date with each other.

There was also additional unit testing included with this version of the dropbox, checking to make sure the results 
of sync operations are as expected, and also checks to make sure no exceptions were thrown in the process. The unit 
test appears to successfully use the Strategy pattern, but a guide to the Strategy pattern has been included in 
this document just for reference.

Suggested reading:
https://en.wikipedia.org/wiki/Strategy_pattern

Suggested improvements:
1) added extra condition to test in expect.js
2) pointed out concerns with lack of user input in index.js
3) pointed out potential superfluousness of setTimeout() in index.js
4) added mechanism for testing in index.js
5) discussed functionality of new feature