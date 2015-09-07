# Review of Frank Cao by Jason Xiong

## Overview

This code provides configurability to a simple dropbox implementation through the use of a config file and commandline arguments for setting and getting configurations. The config file specifies what paths to watch and sync for changes, rather than having to manually add paths to the command-line arguments every time.


## Suggested Improvements

1. There is a possible bug in checking for existing configurations during function checkForChanges(). JavaScript generally requires checking for both undefined and null for object existence.
2. When defining the paths, there's an error when the config file exists but does not contain the correct amount of paths.
3. Rather than casting buffer to string, fs.readFileSync can be used with utf8 encoding option.
4. An option for the user to overwrite paths might be good. This could be implemented by using fs.writeFileSync instead of fs.appendFileSync when file already exists.
5. It might be possible to use JSON format for the config file to make it both easier to work with in code and easier for user to manually change the config file.