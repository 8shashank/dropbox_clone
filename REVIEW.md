# Review of Shashank Sharma by Liyiming Ke

Template: https://raw.githubusercontent.com/cs4278-2015/home/master/REVIEW_TEMPLATE.md

Review Guideline: https://github.com/cs4278-2015/home/blob/master/REVIEW.md


## Overview

 Though the tests are written with 'Chai'&'assert' rather than 'ShouldJS' library as required in class, the test provides a relative complete coverage for the code base and the added feature which enables user to create a ignoreFile and specify files that will not be sync.


## Suggested Readings

Differences between ShouldJS & Chai: http://stackoverflow.com/questions/22081707/chai-versus-should-js-with-mocha-for-node-js


## Suggested Improvements


###1. 

The test coverage for the code base is amazing! But I would recommend avoiding testing minor functions that are 1) Unlikely to break and 2) Trivial to test.

In this case, there are several test on 'whether the localFs handlers call the callback. As it fits in both standards listed above, I would recommend remove the tests for them. 

Also there are some tests on 'whether Pipeline has property addAction and exec', which are not likely to break. 

There is one on 'whether server is connectible', which, in its given form, depends on the function of dnode library rather than logic written for sync-server/client. Therefore, I would recommend remove it.

###2

There is an inline comment asking whether we should test ('file' in fsHandler) or call a function and test if the return value is true.

On this question, see assert library documentation implies that assert(...)=assert.equal(true,...). Therefore, both versions will work.

Yet from the perspective of 'encapsulation', I would prefer the second one. Because the previous one is directly operating on a variable, the latter one appropriately call a get function to access it.

###3

In the tests for sync-driver, all test cases share a common 'before' and 'after' function. These two hooks are used to arrange files. And within each test, it will call checkForChanges to sync the files. 

However, it becomes unnecessary to call checkForChanges again and again in later test cases. Because the checkForChanges in first test cases will sync files. Every call after it only check for difference (which is none), and stop. 

Therefore, I would recommend either to 

1) call checkForChanges within the before function. And call test cases to assert but not operate on files. (This is implemented) 

or to

2) change hooks to 'beforeEach' and 'afterEach' to re-initialize files before and after every test case, then checkForChanges will become meaningful.

###4

Add test coverage in checkForChanges#1 for the case that both folders have ignore file. In one of them specify file1 to be ignored, and the other does not. But there is a file1 existing in both folder.

###5

Add test coverage for checkForChanges when both folders do not have an ignore file specified. 

###6

Add test coverage for updating ignore files (I believe this is essential for the feature), then checkForChanges to make sure the update function works.

###7

Expose some functions to make them testable and add test coverage.

The test as it is now shall provide a good coverage from the view of BDD. Yet, many business logic is not directly tested. Some of them has can be easily taken out to be independent from the code base and be tested.

One example would be the function removeIgnoredFiles. It simply process what is given and return the result. Therefore it would be helpful to export it and add tests for it.

