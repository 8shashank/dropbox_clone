# Review of Tazrian Rafi by Lawrence Waller

## Overview

This code base creates a dropbox-like server in Node.js that syncs two client folders together. It also provides a Node client through
which users can delete files within the dropbox.

Mr. Rafi's additions to the code base provide two additional bits of important functionality. Firstly, Mr. Rafi uses a Node
package called nodemailer to set up a notification system that emails the client whenever their dropbox has been changed.
His code also lets the server know that the email has been sent out successfully.

Finally, Mr. Rafi added a rename function to his code. It implements a ">rename" server command (which, by the way,
follows the Gang of Four Command and Interpreter Patterns) that allows the client to choose a file in their dropbox and
rename it from within the client shell.

## Suggested Reading Materials

This article that I found does a pretty good job at explaining how to set up a package.json file, which was one of your
mistakes: http://blog.nodejitsu.com/package-dependencies-done-right/

## Suggested Improvements

1. As you might see once you read the above article, your package.json file was not configured with a dependency on
nodemailer. I went ahead and included that dependency; I suggest you read the article so you can know how to set up
your package.json file for the next assignment!

2. Your email notification service only notifies one default, hardcoded email of changes to the dropbox. I suggested that, rather
than hard-coding the default email, you should include it in a top-level variable (I've called it globalDefaultIntendedRecipient).

3. In fact, you can go further than that; why shouldn't the client have the ability to set which email address receives the
dropbox notifications?! I showed you in your code how to add a function called emailToWho to the list of client commands.
The client can use that function to reset the emailee. Of course, the default email hard-coding was left in, in case the client
doesn't want to change it.

4. This is more of a thematic suggestion--while your rename function is good, it is vulnerable to human error because it
does not provide to the client a list of eligible files from which they can choose a file to rename. Your error handling is
good, but if you were to follow my suggestions in the code, errors might be avoided entirely.

5. Finally, your rename function has a bug. If you call ">rename" with only one argument instead of two, the file to be renamed
is simply called "undefined"--because the second argument to the rename function is undefined. I suggest (and I provided
a sample implementation) that you add a default file name into the rename function, so that if the user leaves the second
argument to rename blank, the file is renamed to defaultName.txt rather than being stripped of any name meaning and left "undefined".