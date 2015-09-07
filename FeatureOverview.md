#Dropbox Application 2.0

##Overview

For this project, I extended the Dropbox server/client implementation to allow the user to view the synced directory on a website. This allows any user to view the synced documents and files, regardless of the machine they are on. 

##Installation

To install this application globally on your machine, run the following instructions on your machine from the directory containing index.js:

```
sudo npm install -g
```

##Usage
Assume that you have the following folder structure:
* test-data
  * folder1
  * folder1

First, start the server. For this example, you will need to cd into the  "test-data" directory, then run:

```
dropbox-server
```

Next, you will need to start the client. This will have to be run from a second terminal window. Cd to the same folder, "test-data", run the following:

```
dropbox --d1 dnode://folder1 --d2 file://folder2
```

Finally, you will need to start the web page that will display the directory. In a third terminal window, cd to the directory containing index.js, and run the following:

```
http-server test-data
```

You should see something like the following:

```
Edward Yun:assignment2-handin edwardyun$ http-server
Starting up http-server, serving ./ on: http://0.0.0.0:8081
Hit CTRL-C to stop the server
```

The website is now running on your localhost. If you run
```
ifconfig
```
from your terminal, you can view the same webpage on a global IP address that anybody on your same network can view. It will look something like

```
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether b8:e8:56:32:6e:c4 
	inet6 fe80::bae8:56ff:fe32:6ec4%en0 prefixlen 64 scopeid 0x4 
	inet 10.66.163.50 netmask 0xffff0000 broadcast 10.66.255.255
```

Append the host ending from aboce to the inet address to view your directory. In this case, it would be:

```
http://10.66.163.50:8081
```

Whatever you put into folder1 or folder2 will be copied to the other folder, and the website after you refresh the page. 

##Code Overview
The web directory extension is mostly housed in the http-server folder. 

##Importing the Project Into Webstorm
Open WebStorm and then choose File->Open and then choose the directory containing index.js.

