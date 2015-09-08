# Review of Parker Klein by Jonathan Schenker

## Overview

This submission adds a number of command line options for the dropbox sync system. They include: add(path), del(path), lastUpdated() and quit(). 
Two test functions were also added, test() and func(int1, int2). 

No tests were added to the tests.js file to check functionality of added code.

The lastUpdated method outputs a dateTime in readable text format, which was a significant feature for the function.

The commands are read by a getUserInput() function that takes readline input.



## Suggested Improvements

1. There already exists a simple way to ouput the datetime info from UTC data.

2. 'help' command print-out has been given some information for each additional command.