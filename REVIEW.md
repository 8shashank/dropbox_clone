#Review of Baihua Xuan by Shashank Sharma

##Overview
The code implements the delete functionality 
which removes the file from both the nodes being synced, and also has an authentication feature which allows the user to log in using pre-set credentials.

It uses the function invocation pattern to pass in  
pass in user arguments from the command line as an array and invoke the different commands.

##Improvements
1. Extract the login method outside of the userOps dictionary like all the other methods in the dictionary.
2. Add a explanatory message for all the possible commands.
3. Prevent multiple login attempts to avert possible errors.
4. Remove ".idea" folder from repository.
5. Extract the authentication check from all of the methods of the server-side handler. Could not find a proper way to add this.