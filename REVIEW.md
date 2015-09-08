Review of Chris Su by Tazrian Haider Rafi

# Dropbox Application

## Overview

This is a very rough implementation of a Dropbox server and client. The client and server
coordinate to sync two different directories similar to dropbox.

The Dropbox server accepts connections over a socket and allows clients to read the list of any
files within its root (or possibly outside), get stats about those files, and read or write to
those files. The client connects and continually checks the two folders for changes and then
copies over any changes from one folder that are needed in the other. If the folder passed as
a command line argument starts with "dnode://", then the client uses the server to obtain information
about that folder. If the folder starts with "file://", then the client uses local file operations
to read/sync the directory.

Chris Su added functionality of posting all eligible files to twitter. The list of eligible files include:".gif",".png", ".webp", ".jpeg".

ChrisSu also had unfinished implementation of a similar feature for Facebook.



Review by Tazrian Haider Rafi:

1. Changed the facebook message to make it more meaningful. This should give users an idea of whats happening.

2. Added a function that uses OAuth to generate an access token that the user can use. I havent filled in the application specific keys as I don't have them, but it should give you an idea on how to get an access token instead of hardcoding it. 

3. I added your facebook and twit dependencies to package.json, so that you do not have to install them manually after installing the application globally.

4. The twitter.js file was redundant, as the code was already added to index.js. I removed that file.

5. The twitter functions allows for twits to be sent out just one. This is not ideal. One way to circumvent this would be using Collin Jackson's CLI client implementation, and adding this to the list of 
features, so that it can be invoked multiple times. Update your branch to master to see Collin's changes as they have already been merged to the master. 



Suggested reading material:
Documenation for facebook npm package: https://github.com/Thuzi/facebook-node-sdk