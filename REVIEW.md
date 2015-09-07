# Review of Kevin Liu by Jason Xiong

## Overview

This feature provides an implementation to read a specfile and decide whether of not to sync the contents of the directory in question.

## Suggested Improvements

1. Should probably add .idea to .gitignore in order to keep commit history free from dev configs.
2. fs.readFileSync() only needs the 'utf8' flag to specify reading as a string, no need for toString()
3. makeX(numCopies) isn't implemented or used anywhere, so it can be removed
4. enclosed readFileSync() in trycatch in order to account for spec file being deleted before reading.
5. usage of double equal operator (==) should be avoided in favor of (===) due to implicit type conversions in javascript
