# Review of Chris Lee by Doug Lisk

## Overview
This code is a basic captcha that prompts the user for the answer to 4x4 or 3x3 to verify that the user is not a human. This code uses a simple hash to store the question, answer, and an authentication boolean.
Upon connecting to the server a while loop is started which console.logs the question, prompts the user for input, and authenticates the answer. 
## Suggested Improvements
1.	Randomly generating questions/answers would make this less predictable
2.	If you break out the while loop that checks for authentication each time a question is answered incorrectly it will make more sense to the user, and allow my suggestions in number 3 to be more easily implemented. 
3.	Assign a single question/answer to the user every time they try to connect. This would allow more variety in the questions while removing the need to iterate through questions/answers each time authCheck is called. 
4.	Add common sense questions that are not math related as a computer with the proper grammar could solve any math question
5.	Referring to questions as Null is difficult for users without a computer science background to understand 

##Couldn't properly access Chris' branch

$ git checkout submission/chrislee
error: pathspec 'submission/chrislee' did not match any file(s) known to git.

Sorry :( 

