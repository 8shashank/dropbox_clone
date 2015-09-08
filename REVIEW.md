# Review of Doug Lisk by Grayson Brewer

## Overview

The change to the original dropbox application supplied was the addition of an open-source music recognition software called Echo Nest. Echo Nest describes itself as a music intelligence platform that "synthesizes billions of data points and transforms it into musical understanding to power smarter music applications." Its customers include Spotify, iHeartRadio, Intel and many others. In this instance it is used for its music recognition and identification. The Echo Nest functionality was pulled into the index.js file with a require statement.  The .mp3 recognition occurs in the syncFile function in index.js. An if statement identifies files that have the .mp3 extension and then uploads these files. The console logs the response.

## Suggested Reading Materials

http://developer.echonest.com/docs/v4#resources

## Suggested Improvements

1. syncFile is a lot messier and those 10 lines could be moved to another method. Included in fix.js
2. Instead of calling path.extname(fromPath) multiple times to get the extension, get the extension once and pass it along. Included in fix.js
3. Because of the inability to get a response from Echo Nest, consult the Echo Nest API documentation on their developer site to look at examples and tutorials of how to properly interact with their service.
4. Remove "{weak:false}" from sync-client.js so that Windows users won't run into issues with that.
5. Because the if statement only allows files with .mp3 extensions, there's no need to reference the file extension after that check has been made. Substituted in fix.js.
 