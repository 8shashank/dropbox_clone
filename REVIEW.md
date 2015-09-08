
# Review of \<firstname\> \<lastname\> by \<your\_first\_name\> \<your\_last\_name\> 

## Overview

This code adds an ignore list for files that the user does not wish to be synced. It stores this information in a seperate file called 'neversyncfile.txt'. If the file does not exist, this code will create one.

## Suggested Reading Materials

Stack Overflow discussion on properly checking for existing files
https://stackoverflow.com/questions/17699599/node-js-check-exist-file

nodejs Documentation on fs
https://nodejs.org/api/fs.html#fs_fs_statsync_path

## Suggested Improvements

1. fs.exists and fs.eistsSync have been deprecated by the developers of nodejs, the suggested methodology to check for a files existance is fs.stat and fs.statSync. 

2. Fixed formatting in function fileNeverSync, a console.log was misplaced.

3. Changed the name of 'neversyncfile.txt' to 'ignorelist.txt' to increase clarity of functionality.

4. Changed double quotes throughout code to single quotes for code consistancy.

5. 
