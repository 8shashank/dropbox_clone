#Code Review

## Commit 1 - Made a couple of dnode/weak changes to make it runnable on my machine

    Self Explanatory

## Commit 2 - Cleaned up checking for valid extensions

    Self Explanatory

## Commit 3 - Added the ability to upload only certain files within the folder

    Allow the user to enter a filename instead of just "upload" to then upload just that file

## Commit 4 - Pulled the uploadFile capability out into a separate function

    Adding more options for the user to upload files means that there would be code duplication for each new file if we
    don't pull this out to a separate function. I think that this function could be merged with the initiate function
    but I did not get around to messing with that.

## Commit 5 - Allowing the user to continue performing actions after uploading

    I attempted to pull it out into a function and then if the user types quit, it will stop recursively calling
    itself but since I am completely new to javascript, I can't figure out why it doesn't do the uploading after the
    recursive call.