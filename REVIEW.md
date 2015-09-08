# Code Review

- Author: Liyiming Ke.
- Update: 2015/09/07.


### Format


In code reviews are commented in the following format:

```javascript
// #Review#
// (Original sentence)
//		Comments
//		Comments
(Suggested sentence if any)
```


### Summary


The review includes the following jobs:
   Suggests codes to conduct "compare content feature"
   Suggest improve the onIgnoreList function.
   Suggest implementation of the command line interface.


### Issues

	The project is mainly suffering from async callback versus sync return.

	- onIgnoreList function uses Stream to read, which causes an issue because:
		When onIgnoreList ends, it will return ignore (sync function behavior)
		ReadStream will act in async, and on("end"), it cannot "return" but has to use callback.

	- The command line stream will set a listener to every "line" event, which kind of runs async.


### Other Comments

	I would suggest read a little bit about 

		- https://nodejs.org/api/readline.html
		- https://nodejs.org/api/fs.html
