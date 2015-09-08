# Review of Parker Klein (parkerklein) by Jacob Ho(youngho)

## Overview
This code added extra features(add, delete, update) to the original commandline.
*add: 
First asks for the file name to add and creates the file using the handlers write file function.
The handler will then create a file with the input file name in both directories.
*delete:
First asks for the file name to delete and deletes the file.
*update:
This returns the most recently updated time using the Date object.

## Suggested Reading Materials

None

## Suggested Improvements
1) found a possible problem in add.
Say there exists a file named testcase.txt with data as follows:

testcase.txt
-testcase

If the user calls add testcase.txt the program will overwrite the already existent data. 
I have added the code to check if the file already exists and will not create new file if it does. Check pull.
