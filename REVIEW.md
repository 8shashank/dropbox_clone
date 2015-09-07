# Review of Jonathan Schenker by Collin Jackson

## Overview

The new code added functionality to keep a log of every time a change is synced. All of the changes were made in `index.js` in a logical fashion, with only minimal code manipulation. Additionally, the changes did not expose too much of the underlying code and did not suffer from code duplication.

## Suggested Improvements

1. The date creation for setting the changelog timestamp can be simplified and improved. Instead of calling the Date class to get the UTC string, creating a Date object with a time of 0, then setting the date using the UTC string, you can simply default construct a Date and pass it to `UpdLog`. This also alleviates an issue where the year was being stored incorrectly in the changelog.

2. When updating the changelog, the file path that is being copied from is passed to `UpdLog`, instead of the file path that is being copied to.

3. There was a redundant method definition in `sync.js`.

4. Two of the Sync Module tests in `tests.js` required conflicting file states, so one of them would always fail.

5. The `.idea` folder added by WebStorm is not necessary to track with Git.

Pull Request:
https://github.com/cs4278-2015/assignment2-handin/pull/12
