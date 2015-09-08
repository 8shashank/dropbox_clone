#Review of Liyiming Ke by Shashank Sharma

##Overview
The program supports user authentication such that users can create new accounts and the information is saved on the server. It also encrypts the password using SHA-1 so that the password is not stored in plaintext. The implementation is divided into several files according to the objective of the different functions and was very easy to read and understand.

##Possible Improvements
1. Fixed a bug where Javascript dictionary was being saved as [Object object] instead of being serialized to a file.
2. Instead of using fs.readFileSync and then catching a possible error if it throws, you could use fs.existsSync which handles it better.
3. Added a check to see if new username being added is falsy(empty string in this case). Only the password was being checked previously.
4. Put the method to start a new connection in a method so that you can pass in username and password at different points of the program.
5. When it cannot properly connect, the program doesn't silently die now but asks the user if they want to reenter their credentials. They can try to connect again if their earlier attempts failed. Used the 'prompt' library to implement this.