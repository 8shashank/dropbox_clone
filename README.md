# Review of AJ Ballway by Michael Bassett

## Overview

I moved the chokidar code in index.js into an object in watch.js. The
watcher no longer depends on global variables and instead has its state
injected via a constructor. The constructor now checks parameters for type
validity.

I also lifted verification of command line parameters out of the
watcher constructor and into the caller since it feels unreasonable to push
that responsibility on the object constructor. Additionally, I removed some
dependencies on global state from the dnode connection code in index.js.
