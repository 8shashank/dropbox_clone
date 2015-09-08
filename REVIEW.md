#Review of Frank Cao by Anthony Lew

##Overview

##Suggested Reading Materials

##Suggested Improvements
1. Fixed a comma leftover in package.JSON, possibly from when you installed a module and then deleted it. This did not let me 'npm install' and could not run the program. Make sure you clean up after your code.

2. Since the demand for yargs was taken away. It is possible to run the dropbox command without any options. This will crash the program. Add checking to see if the user has entered either directories or a configuration.