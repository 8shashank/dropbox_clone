# Review of Li Yi Ming Ke by Frank Cao 

## Overview

This could adds authentication functionality, it also encrypts the user's creditionals through the use of the module 'crypto'.

## Suggested Reading Materials

Stack Overflow Discussion on Callbacks vs Promises
https://stackoverflow.com/questions/9391396/node-js-control-flow-callbacks-or-promises

## Suggested Improvements

1. Changed all double quotes to single quotes for code consistency.

2. Fixed formatting on function headers with commas (added spaces in between paramters). Fixed formatting that involves colons as well, adding spaces wherever it makes sense.

3. In the function compare in check.js there is a is a double nested callback to decently complex blocks of code. Promises are a very nice way to avoid callback hell in javascript. It's not a clearly better methodology though, so I didn't replace the callbacks with promises.

4. If the user enters in directories that do not exist, the server will crash and the program will appear like it's working fine. I've added a check to check.js that will check to make sure the user's entries are actual directories and if they are not valid paths, the program will crash with an error that will spit out. This way the server does not crash either when the user enters something incorrect.

5. The package.json file was missing the module 'crypto', if a user wanted to use the module and used the command 'npm install', they would not be able to use crypto.
