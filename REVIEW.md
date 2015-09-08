# Review of Connor McGowan by Michael Bassett

## Overview

I made a few small changes, replacing manual path catenation with calls to
the node.js path module and overuse of lodash's each function with filter.
Additionally, I inlined a callback in the version-checking code to simplify
the code and make the control flow more obvious.

Also, I recommend rethinking the structure of the batch versions of version management functions in order to minimize disk reads since currently there are a lot of redundant accesses that could be pipelined into a single read. Furthermore, some comments explaining the code would be nice, although it is very clear already.
