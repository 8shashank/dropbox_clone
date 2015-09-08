# Review of Shashank Sharma by Liyiming Ke

## Overview

The program implement the "ignore file" feature, that will enable user to put an ignorefile under each sync folder. The implementation is well-structured. It reads and update an ignoreArray when needed, and neatly check whether a file is ignored before pass it to compare. However, the implementation leaves a usage scenario under question, and might be improved by grouping logic into function and address async function callbacks.


## Suggested Improvements


1. The implementation might be improved if the function makes use of getHandler rather than directly call file system library.

2. There is a small bug when clearing cache for the ignoreFile var. (sync.js) In-line suggestion is provided in pull request.

3. The implementation might want to wrap some logic in function. As this will improve the modularity and paves way for async function.

4. There are some functions that could be replaced by shorter call to library. In-line suggestions are provided.

5. The implementation has not addressed to an important and potential dangerous usage scenario:

	- Folder1 has an ignore file preventing sync "1.txt"
	- While folder2 has a file "1.txt" to be sync?
	- The current program will still copy from folder2 to folder1 and overwrite folder1's file.
	- Is this a desired behavior for this case?


6. The commit message for file [base64utils.js](https://github.com/cs4278-2015/assignment2-handin/blob/submission/shashanksharma/lib/sync/base64utils.js) is a bit confusing.

   - The message suggests that there were some changes in code.
   - But the code seems to be untouched.
   - Maybe you want to say "revert to previous version" instead?
        
 7. In test.js, the function to test "folder1 should need test2.txt and test.txt sync'd to it, but folder2 shouldn't need anything sync'd" is removed.

   - I understand that since test-data changed, this might not work now.
   - But it does not seem to hurt to keep those files and test units.
   - And now this program has no test covering whether the normal compare works.
