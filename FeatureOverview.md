#Dropbox Application 2.0

##Overview

For this project, I extended the Dropbox server/client implementation to allow the user to view the synced directory on a website. This allows any user to view the synced documents and files, regardless of the machine they are on. 

##Installation

To install this application globally on your machine, run the following instructions on your machine from the directory containing index.js:

'
sudo npm install -g
'

##Usage
Assume that you have the following folder structure:
* test-data
  * folder1
  * folder1

First, start the server. For this example, you will need to cd into the  "test-data" directory, then run:

'
dropbox-server
'

Next, you will need to start the client. This will have to be run from a second terminal window. Cd to the same folder, "test-data", run the following:

'
dropbox --d1 dnode://folder1 --d2 file://folder2
'

Finally, you will need to start the web page that will display the directory. In a third terminal window, cd to the directory containing index.js, and run the following:

'
http-server
'

Whatever you put into folder1 or folder2 will be copied to the other folder, and the website after you refresh the page. 

