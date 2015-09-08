#Review of Frank Cao by Anthony Lew

##Overview

##Suggested Reading Materials
https://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/

##Suggested Improvements
1. Fixed a comma leftover in package.JSON, possibly from when you installed a module and then deleted it. This did not let me 'npm install' and could not run the program. Make sure you clean up after your code.

2. Since the demand for yargs was taken away. It is possible to run the dropbox command without any options. This will crash the program. Add checking to see if the user has entered either directories or a configuration.

3. Just use the fact that a defined string is true in your if statements. It will also help detect for null values / empty strings.