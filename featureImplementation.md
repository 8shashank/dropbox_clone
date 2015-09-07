Author : Jacob Ho (youngho)
features: implemented feature to not sync files stated in .ignore files of each folder.
	1) read all the files
	2) read in list of files from .ignore
	3) compare and check if file to sync is in .ignore
	4) if it is in .ignore, it will not sync the file.

future features to work on: 
	1) further check if the feature can ask the user for input. 
		ex) for files that are newly added, the program will ask the user whether to sync the file.
			if the user inputs no, then the program adds the file to .ignore, which will prevent the file from sync.
	2) manipulate files in remote.
		ex) the users should can add/delete files in remote directory. 
