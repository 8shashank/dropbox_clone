#Review of Edward Yun by Emma Birdsong


  ###Overview 

The base of this assignment is a rough implementation of dropbox between a server and a client. Whenever the user has
 the server running, any file in one folder of the test-data will be copied to the other and a statement will be printed
 telling the user what was done. The feature that was added to this program was a visual web interface. This allowed the
user to view their directories online and see the contents of their folders. If a file was copied from one folder to 
another or the name of a file was changed the interface would update upon refresh. This was accomplished using the http-
server node module.

   ###Suggested Improvements
 1. The initial problem I ran into with this code was in the feature's description. According to the description, 
      changing to the directory that contains index.js and entering http-server test-data in the command line. However,
      this command didn't work for me. After some work, I have found a better way of connecting to the server. 
     the user should first cd into node_modules/http-server/bin then enter node http-server ../../../test-data
2. The next issue that I ran into was a lack of preparation for a bad request. Whenever I attempted to enter a bad 
    request, instead of getting a 404 message I got a blank page. However, upon further inspection, I think this is an 
    issue with the module. I don't understand the module well enough to fix this issue but my advice would be to 
    implement the server yourself in sync-server then it would be simpler to implement the 404 response. 
 3. When I was attempting to run this I kept having to install modules that didn't appear to be used. So, my next 
    suggestion would be to uninstall these modules. This could be accomplished by removing require statements and 
    running npm uninstall <module> commands 
4. It could be useful to find the IP address to put into the url. I would use a similar implementation to what I used in
    my own feature, however I would implement it in 
 5. Further explanation of web interface

