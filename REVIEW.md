#Review of Emma Birdsong by Anthony Lew

##Overview

This feature packages a HTTP server into the original sync-server. The purpose of including a HTTP server is to allow users to share files over a web browser. The HTTP server listens in on the hard-coded port 8000. If the file exists, the HTTP server will send the file over. Otherwise, the web server will display an error page.

##Suggested Reading Materials

##Suggested Improvements
1. Shareable link cuts off the first letter. This is due to the substring(8) on your path name, which is not necessarily always correct. A better solution is to look for the "//" in the path name.

For example: It says 

"Shareable link: http://10.66.151.204:8000/est-data/folder2/DSC_2020.jpg".

When it should say "Shareable link: http://10.66.151.204:8000/test-data/folder2/DSC_2020.jpg"