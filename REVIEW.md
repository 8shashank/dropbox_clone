#REVIEW OF CHRIS LEE BY TAYLOR ZHANG

@Overview:

This code attempts to authenticate the user on the onset of connecting to the server. Due to the rudimentary nature
of these questions, I assume that it is to protect the server from non-human users (much  like captcha). If you do not 
get the answer correct, you will not be able to use the dropbox; this is how Chris wants his code to act. The authentication
logic uses an authentication object, question arrays, and answer arrays. If you get a question wrong, Chris would want you to
answer the next question in the question array. Several things in the code prevented correct behavior.

@Suggested Improvements: 

1. Bugfix - authenticate function was not accessible from where the function was being called
2. Improvement - Use error checking when using prompt
3. Bugfix - Infinite loop when dnodeClient connects to server; authenticate.authenticated will always return false and prompt
will not actually stop execution of the code. I do not understand why prompt does not stop execution.
4. Bugfix - triple equals is not a correct assignment statement
5. Improvement - Perhaps find a library/dictionary of random questions for authentication. This will make it harder to randomly
guess and improve security. Another idea is to continue to use simple math questions but don't use concrete arrays; randomize
the math problem everytime and let the program figure out if it is right or wrong rather than creating an array of answers 
to check against.

@@General comment:

I see what you were trying to do with the authentication method, but the array checking and for loop was made to be 
far too complex than what it could have been indavertently causing two infinite loops. 
Instead of iterating through two arrays, you could use a map instead. I fixed many errors and tried to make it so that
you authenticate everytime you change a file instead of on connect. It's still buggy; I would suggest rewriting the authenticate 
function using a better system (see suggestion number 5). I might also be misinterpreting why you put the code in sync-server.js in the
first place; perhaps the code could work there if you can correctly export the function so that it is accesssible in index.js.

@@Suggested Readings:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map


