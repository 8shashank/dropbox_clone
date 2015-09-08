# Review of Matthew Owens by Liyiming Ke

  Author: Liyiming Ke
  Date: 2015/09/07

## Overview


This project intends to implement three features for the given dropbox implementation:

  - Enable users to specify which file to ignore.
  		The implementation requires a file to be put under the client root directory.
  		The program will repeatly check the ignore file everytime before it compares two files.
  		However because the check function will use stream (async) process, it might fail to do its job.

  - Compare file content, rather than file size.
  		The implementation was commented out as the program could not find a way to pass the path to the matcher function.

  - Prompt user to specify directories rather than passed in as arguments.
  		The prompt was commented out because the program has issues with async callback.


The design of architecture of the code is good, in respect to division among functionality and modularity. However some implementations will not work because the program might not have considered enough on async function callbacks versus the sync function returns. In the in-line comment review, the reviewer suggested some sample functions to address the problem of async callbacks. 

## Suggested Reading Materials


If possible, the reviewer would suggest a dive into the library documentation at:

	- https://nodejs.org/api/readline.html
	- https://nodejs.org/api/fs.html

And further the program might benefit from a more thorough understanding of asynchorous functions. 


## Suggested Improvements


1.  In implementing the "ignore file" feature, the program suppose that the ignore file will always exist and is defenseless from the case that the ignore file does not exist.

2.  In implementing the "ignore file" feature, the program uses createReadStream which is an async function call and try to "return" the content after the function done. Yet the onIgnoreList function will also return. In this process. There are two problems:

	- The return sentence in on(line) might throw exception, as it is an async call and where it returns to is not so clearly defined. 
	- The return value of onIgnoreList function might not have the expected return value, as the async function is not finished.

	A commit is submitted: https://github.com/cs4278-2015/assignment2-handin/tree/45434c0bf99c5877093706dcebbd85ac8c0b44c2

3. In implementing the "ignore file" feature, the onIgnoreList function might have been executed too many times. It might be helpful to read the content into a var during capture directory state and check that var, rather than read from the ignore file everytime the function runs.

4. In implementing the "compare file content" function uses stream, which is potentially problematic as the same reason specified above.

	A commit is submitted: https://github.com/cs4278-2015/assignment2-handin/tree/9134b50a215564fe97320edd4c323007d30dbabc

5. In implementing the "prompt user input" function, the program tries to prompt again in on(line) function. This will not deliver expected behavior. 
	
	A commit is subimtted: https://github.com/cs4278-2015/assignment2-handin/tree/650efe0b9a91b1c0bf39670f64b89245d62b0aa7