# Review of Baihua Xuan by Eric Yang

## Overview

The overall functionality is to add a log in/authentication process in order to be able to use the dropbox functionality. First a login function is added to the possible user operations. The login function then connects to the server. A callback function is called upon connection and the username and password is sent to a handler which goes to the server and checks if the password and username match. Depending on the outcome of the validation process, either the user will be able to begin syncing or enter in new commands or have to log in again. 



## Suggested Improvements

1. In index.js where you added your login function in 'userOps' you can take out the function and create a new function outside of 'userOps'. I think this would make userOps a lot cleaner.
2. Also instead of having the input as <login, user, password> as the command, you could prompt the user for the login credentials after the login command has been initiated. 
3. After the user logs in, it would be nice to allow the login option not avaliable anymore. This could prevent further bugs that arise if someone tries to log in again or uses wrong login info after already being connected.
4. There is a bug where if someone fails to log in multiple times but does not quit, the message gets printed several times. I believe the listeners are not being closed correctly, not exactly sure how to fix it. I would suggest having to quit then relog in as a simple solution, but maybe not the best.
5. Another suggestions is that the only commands that can be entered is login and help until the user logs in, and then the user can access other commands.