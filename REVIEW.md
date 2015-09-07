# Review of Anthony Lew by Tommy Meisel

## Overview

*Provide a 1-3 paragraph overview of the architecture of the code and the design rationale.*

This module sends a given email address an update of the files that were modified in a specific timeframe. It does this by checking each file in the first directory given and if the file was modified in the timeframe, it adds that file to a list to be emailed.

## Suggested Improvements

*Provide a list of 5+ aspects of the code that should be improved. Each suggestion for improvement should be accompanied by a GitHub pull request on the reviewee's submission repo that shows how to perform the suggested refactoring. If the change is so substantial that it is "rewriting" the solution, break it down into a series of refactorings that build on each other to improve the solution (each refactoring committed separately and submitted as a pull request with a thorough explanation).*

1. Error handling in the emailUpdates function in updateemailer.js can be condensed to one line. Also, changed the errors in the createEmailBody function in index.js from console.log(err) to console.error(err).