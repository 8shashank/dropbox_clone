#Review of Grayson Brewer (graysonbrewer) by Jacob Ho(youngho)

## Overview
The coder added a feature in the argument. 
By passing the argument -i <filename>(//test-data/folder1/test1.txt) the program will not sync the specified files.

##Suggested Reading Materials

1) https://www.npmjs.com/package/yargs => look for .array

## Suggested Improvements(some fixed by youngho)
1) When the program is ran without the -i argument, all files should sync. However, for some reasons not known, test.txt is not synced.  

2) Changed yargs. By using .array('<option name>') you can get the inputs as an array.
	ex) ... --i test.txt test2.txt  will result in ['test.txt', 'test2.txt']

3) Added refineArgs() function to refine argument. (//test-data/folder1/test.txt -> test.txt)
   However, since the program only uses the file name and not the path, I believe it might be easier for the user to just input file name only.
   --i test.txt test2.txt
   I have not changed the yargs description for this but if you feel this change is fine, pull and merge. 
   If you fine with using just the file names, you can ignore using refineArgs().
