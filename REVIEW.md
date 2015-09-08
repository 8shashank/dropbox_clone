Review of Troy Janikowski by Kevin Liu
Overview
This code provides the user an option to delete certain files. The main function used to achieve this is housed in index.js and is called del. Del works by first prompting the user for the name of a file to delete and then deleting said file. After deletion and message is sent to the user confirming his/her file has been deleted. 

Suggested Reading Materials
None
Suggested Improvements
1.	As stated by Troy, the current code cannot delete files with spaces in their names. I haven¡¯t been able to get this to work, but one idea I did get was to maybe extract the file name. Separate the name per space and save those individual bits. Then create a new directory variable with +¡±\¡± + savedBits. The backslash should allow one to ignore the spaces, but once again, I couldn¡¯t get this to work. Might be worth checking out, might not. 
2.	
