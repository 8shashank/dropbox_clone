# Review of Matthew Owens by Edward Yun

## Overview

This code adds an Ignore_List.text file that allows the user to specific certain files that should be ignored when syncing between the two folders. 

The code also adds a matcher for checking if files have matching names, sizes, and contents, and a command line interface that asks for directories to use instead of taking them as directories. 

## Suggested Reading Materials
1. http://tutorialzine.com/2014/09/creating-your-first-node-js-command-line-application/

2. https://www.npmjs.com/package/commander

3. https://nodejs.org/docs/latest/api/globals.html#globals_filename

4. https://nodejs.org/docs/latest/api/globals.html#globals_dirname

5. n/a

## Suggested Improvements

**Each of the following improvements corresponds directly with the above suggested reading materials.**

1. Add your command line utility the package.json file by running npm init

2. Use the commander module to parse command line arguments for your command line interface

3. You can use __dirname to find the path to each file for your matcher filesMatchContent function

4. You can use __filename to find the path to each file for your matcher filesMatchContent function

5. You could let the Ignore_List.txt accept file extensions as "*.txt" and ignore any file that ends in .txt. 