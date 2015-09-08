#Review of Grayson Brewer (graysonbrewer) by Jacob Ho(youngho)

## Overview
The coder added a two new arguments to the command.
i) --a argument 
	this argument decides whether the program will sync or not.
ii) --i argument
	By passing the argument --i <filename>(//test-data/folder1/test1.txt) the program will not sync the specified files.

##Suggested Reading Materials

1) https://www.npmjs.com/package/yargs => look for .array

## Suggested Improvements(some fixed by youngho)
1) (NOT FIXED)When the program is ran without the -i argument, all files should sync. However, for some reasons not known, test.txt is not synced.  
   As the original author has said, current code is not synced with the bug-fixed master code. Thus, it seems to cause problem in syncing following case:
   i) if both files are same in size and has same name.
   Unfortunately, I could not find a way to solve the problem on 'why test.txt is not synced'.

2)(fixed) Changed yargs. By using .array('<option name>') you can get the inputs as an array.
	ex) ... --i test.txt test2.txt  will result in ['test.txt', 'test2.txt']

3) (fixed)Added refineArgs() function to refine argument. (//test-data/folder1/test.txt -> test.txt)
   However, since the program only uses the file name and not the path, I believe it might be easier for the user to just input file name only.
   --i test.txt test2.txt
   I have not changed the yargs description for this but if you feel this change is fine, pull and merge. 
   If you fine with using just the file names, you can ignore using refineArgs().
