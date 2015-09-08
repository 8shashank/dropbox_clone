#Review of Taylor Zhang by Nicolas Kline


###Overview
This code creates a Log file of changes made to the files using a readline interface. When the server registers a change made to the files and copies them over to the other directory, the interface prompts the user for a username. It then appends to a file called Log.txt (if no such file exists, it will create it in the directory that contains index.js) with the name of the user who made the change, the file changed, and the date when they made the change. To grab the date, he used the moment module with the date format Month Date Year, Hr:Min:Sec am/pm. If there is an error in the resulting string, the error is thrown back.


###Suggested Improvements
1. Not a huge change, but a comment or an edit of the README to specify that your users must have moment installed in order for the server to run would make your code more user-friendly.
2. It's not easy to tell when your application has finished. A simple console.log output could let your user know that the log has been created.
3. Bug Fix. Line 47.17 should be erased. If you close the stream, any additional changes to the files won't be registered.
4. More specific messages. Right now it only says that the file was edited, but if a file is created.
5. You could invite the user to specify the date format.