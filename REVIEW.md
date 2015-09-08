# Review of Nick Sparkman by Matthew Owens

## Overview

*Overview will go here.*

## Suggested Reading Materials

*Suggested reading materials will go here.*

## Suggested Improvements

Because the program won't execute for me due to the problem with 'mkdirp' (described in Suggestion 1), I have tried to refrain from making any major code changes in this code review. Instead, I included comments explaining how to address the issues that I found.

1. Can't find the 'mkdirp' module anywhere, and I get an error when I try to install it with NPM. I can't run your program because of this. My recommendation (commit ee053a4) is to include it in your package.json file so it will automatically be installed when the 'npm install' command is run.
2. In 'sync-client.js', the 'count' variable is used to keep track of whether the backup directory has been created already or not. However, it is not counting beyond 1 for any particular reason. This refactoring (commmit 12010b4) presents a recommendation to make this variable a boolean value. This is better practice and would make your code easier to understand.
3. Currently, the copying functionality is tightly couple with the writeFile functions in 'sync-client.js' and 'sync.js'. I would write a separate function called "copyToBackup" that copies the file to the backup directory. There is no reason that it needs to be in the writeFile, and reducing coupling is always good programming practice. It would also eliminate the duplication of having this same code in both sync-client.js and sync.js.

