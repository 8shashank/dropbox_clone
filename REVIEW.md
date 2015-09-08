#Review of Baihua Xuan by Shashank Sharma

##Overview
The code implements the delete functionality 
which removes the file from both the nodes being synced, and also has an authentication feature which allows the user to log in using pre-set credentials.

It uses the function invocation pattern to pass in  
pass in user arguments from the command line as an array and invoke the different commands.

##Possible Changes
I've made a couple of changes to the code in this branch. Feel free to go through them and see if any of them could be applied to your branch.

1. One possible change was to extract the login method outside of the userOps dictionary like all the other methods in the dictionary.
2. You could also add a explanatory message for all the possible commands.
3. To avert possible errors, I removed multiple login attempts.
4. Removed ".idea" folder from repository. It is already untracked but it could be removed altogether.
5. Extract the authentication check from all of the methods of the server-side handler. Could not find a proper way to add this.