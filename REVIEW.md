# Review of Lawrence Waller by Collin Jackson

## Overview

No changes were made to the existing code. The additions consist of a simple webpage that takes user input and a server that handles the input. Communication between the server and webpage is handled via POST.

## Suggested Improvements

1. Change the location of `commentlog.txt`. If the directory `ClientMessageLog` does not exist, attempting to open the file results in an error.

2. Remove redundancy of what is logged to the console and what is written to `commentlog.txt`.

3. Consider using Jade instead of HTML for your website code (see http://jade-lang.com). It is closer in style to other programming languages and allows for more succinct code.

4. Change `fs.write` to the version that only needs the file descriptor, data, and callback (see https://nodejs.org/api/fs.html#fs_fs_write_fd_data_position_encoding_callback). This makes the parameter list simpler and also alleviates the need to create a buffer.

5. Use Express's routing capabilities to abstract away the name of the homepage for your site.
