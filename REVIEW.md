
# Review of \<firstname\> \<lastname\> by \<your\_first\_name\> \<your\_last\_name\> 

## Overview

This code adds an ignore list for files that the user does not wish to be synced. It stores this information in a seperate file called 'neversyncfile.txt'. If the file does not exist, this code will create one.

## Suggested Reading Materials

Stack Overflow discussion on properly checking for existing files
https://stackoverflow.com/questions/17699599/node-js-check-exist-file

nodejs Documentation on fs
https://nodejs.org/api/fs.html#fs_fs_statsync_path

nodejs Documentation on readline
https://nodejs.org/api/readline.html

## Suggested Improvements

1. fs.exists and fs.eistsSync have been deprecated by the developers of nodejs, the suggested methodology to check for a files existance is fs.stat and fs.statSync. 

2. Fixed formatting in function fileNeverSync, a console.log was misplaced.

3. Changed double quotes throughout code to single quotes for code consistancy.

4. Would advise against using the module 'readline' for now, the module is currently considered unstable. I'm not sure if a third party module would be superior however, so I don't have a good solution for this.

5. The process for creating a file if one doesn't exist is currently bugged, if the user doesn't have a pre-existing 'neversyncfile.txt' the program will crash.
