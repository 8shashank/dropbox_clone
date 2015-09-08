# Code Review

- Author: Liyiming Ke.
- Update: 2015/09/07.


### Summary


In code reviews are commented in the following format:

```javascript
// #Review#
// (Original sentence)
//		Comments
//		Comments
(Suggested sentence)
```

Most reviews are suggesting:

   Use of async + callbacks⋅⋅
   Wrapping logic in function⋅⋅
   Some shorter sentences to do job⋅⋅


### Issues


A really important question that I would like to ask is:

What will happen if:

	- Folder1 has an ignore file preventing sync "1.txt"
	- While folder2 has a file "1.txt" to be sync?
	- The current program will still copy from folder2 to folder1 and overwrite folder1's file.
	- Is this a desired behavior for this case?


### Other Comments


 * The commit message for file [base64utils.js](https://github.com/cs4278-2015/assignment2-handin/blob/submission/shashanksharma/lib/sync/base64utils.js) is a bit confusing.

   - The message suggests that there were some changes in code.
   - But the code seems to be untouched.
   - Maybe you want to say "revert to previous version" instead?
        

 * In test.js, the function to test "folder1 should need test2.txt and test.txt sync'd to it, but folder2 shouldn't need anything sync'd" is removed.

   - I understand that since test-data changed, this might not work now.
   - But it does not seem to hurt to keep those files and test units.
   - And now this program has no test covering whether the normal compare works.
