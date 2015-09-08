#Review of Grayson Brewer (graysonbrewer) by Jacob Ho(youngho)

## Overview
The coder added a feature in the argument. 
By passing the argument -i <filename>(//test-data/folder1/test1.txt) the program will not sync the specified files.

##Suggested Reading Materials

None

## Suggested Improvements
1) When the program is ran without the -i argument, all files should sync. However, for some reasons not known, test.txt is not synced. 
2) The commands to run the program is not described in any of the files. Currently not able to check if -i argument works
=> found out how to run the command. 
	ex) dropbox --d1 dnode://test-data/folder1 --d2://test-data/folder2 --i1 <file path>
	The ignore argument however does not seem to 'ignore' the actual file. Still syncs. 
3) fixed argument 'i' -> 'i1' for consistency.
