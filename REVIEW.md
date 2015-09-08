#Review of Chris Su by Emma Birdsong

###Overview
The original function of this program was a basic dropbox that connected a client and a server such that if a file was 
added or modified in one folder it would be added or modified in the other. The feature that was added here was 
two-fold, facebook and twitter capabilities. If a file with a jpg or gif extension is added to a folder, it can be shared 
via facebook and twitter. This is done by utilizing facebook and twitter npm modules.

###Suggested Improvements
1. The first issue I ran into with this code was the lack of a README document explaining what the feature is and how it
    works. This made it very difficult for me to understand exactly what is going on. Because I didn't build this and 
    still don't have a thorough understanding of the program, I can't correct this problem.
2. The second issue I noticed was the lack of semi-colons in the twitter.js file. While they aren't exactly necessary,
    it is better for style and readability to add them.
3. In the facebook.js file, there are two require('fb') statements. One can be deleted.
4. The facebook setAccessToken in the facebook.js file is very long. I do not know if there is a fix for this, but it 
    is something that stood out to me.
5. An improvement I think could be made would be the option to only upload specific files instead of uploading all of 
    the files in the server folder. This could be accomplished by allowing for console input specifying a file.