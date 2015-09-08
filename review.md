A handler is added to obtain and process user inputs to perform corresponding functions. It allows a user to specify a
file to delete and it includes a rename functionality that lets the user choose and rename a file.  It also uses the
Nodemailer module to send email alerts when a file is copied, renamed, or deleted.

1. When creating the transporter variable, try passing in the user and password as arguments to avoid hardcoding
sensitive information.

2. In the mailOptions, pass in recipient's email as an argument to allow the user to choose who to send the email to.

3. In functions that check for file in directory by passing in file name, check for existence of such file.

4. In case the emailMessager function is not called right away, mailOptions should include date/time to alert user of
when the action was carried out.

5. Pass in a array of email addresses to alert multiple users.
