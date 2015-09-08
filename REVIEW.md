#Review of Nick Sparkman by Nick Kline

###Overview
This code creates a backup directory of both the server and client files in the dropbox. It examines whether the file has
already been created. If so, it then examines whether a backup directory has already been created. If not, it creates the
new directory using the mkdirp node module, reads the file that was copied over the test code, and then writes the changes
into the backup directory. If it already has been created, it writes as usual.

###Suggested Improvements
1. BUG: The directory never gets created because path === uris.getPath(path) will never be true. uris.getPath doesn't search for a file, it creates a substring cutting off the protocol (i.e. dnode://foo/bar becomes foo/bar). The path passed into writeFile will always have the protocol out front.
   FIX: changed it to use fs.statSync and .isFile()
2. sync-client.js required "/mkdirp" when it should have required "mkdirp"
3. sync-client.js needed to require "./base64utils"
4. small bug: The backup directory created another subfolder called assignment2-handin within assignment2-handin. Think you just wanted to put it in test-data so I changed it.
5. BUG: Once a directory is created, nothing actually gets written into it. May have something to do with callback asynchronicity but I'm not sure (I'm new to Javascript and don't fully understand callbacks).
   FIX: Not completely done, but it writes to one of the corresponding temp directories. Stuff copied from folder1 into folder2 is put into tmdir but not tmdir2, and stuff copied from folder2 into folder1 is put into tmdir2 but not tmdir1. The temp directories do not have the entire contents of their corresponding folders. Not sure if this is the desired functionality. If it is, great!