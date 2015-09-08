#Review of Edward Yun by Emma Birdsong

###Overview
The base of this assignment is a rough implementation of dropbox between a server and a client. Whenever the user has
the server running, any file in one folder of the test-data will be copied to the other and a statement will be printed
telling the user what was done. 


###Suggested Improvements
1. The initial problem I ran into with this code was in the feature's description. According to the description, 
     changing to the directory that contains index.js and entering http-server test-data in the command line. However, 
     this command didn't work for me. With my own server, I stayed in the main directory and used node and the path to 
     the file containing my server. This implementation could solve this issue.
2. Another issue with the code is the lack of preparation for a bad request. This could be bad because if the server 
    gets a request it can't handle, there is no response set up. This could be fixed by adding a 404 not found message.
3. I also thought that the http-serve file was very lengthy, and the server itself could be added in the sync-server 
    file.
4. Print url
5. The last issue I came across is minor, but could cause problems for users. In the featue description you say to 
    append "8081" to the code but you use server 8080.