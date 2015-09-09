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

If the user calls 'add testcase.txt' the program will overwrite the already existent data. 
I have added the code to check if the file already exists and will not create new file if it does.

2) The original code of add() creates files in both folder1 and folder2. However, since the two folders will be synced, 
	I thought it might simplify the code to just create a single file in folder1. The file added to folder1 would eventually be synced to folder2,
	which would have been the original intention of add().
	=>(update): Even though this does simplify the code, it causes differences in time of creation. If you prioritize simplicity over efficiency, than use the suggestion,
				but if not, then I believe your code is fine since the original code creates two files at the same time.

3) Suggestion: for the below code, naming the variables does make it look clean. However, i think it might be shorter and create less variables if changed as below. 
original:
	var dayOfWeek = time.getDay();
    var dayName = dayNames[dayOfWeek];
suggestion:
	var dayName = dayNames[time.getDay()];

4) Suggestion: the update function works great. Except, when the user restarts the program, one cannot see the previous update.
It might be good if in the beginning of the program, a function reads in the most recent file's timestamp and save it in lastupdated variable.
By this way, even if the program restarts, the update command will consistently show most recent update time.

5) changed date format. 
	I do not know if it was intentional or not but the date format was hour:minute.second
	So, I changed it to hour:minute:second.
