Lawrence Waller README

My implementation of this assignment is a GUI that the client can use to send comments or questions to the operator of the server.

Open up a terminal and invoke node on QuestionGUIServer.js; then pull up a webpage and go to 127.0.0.8080/basicweb.html

Here are the features I implemented:

1) uses the express and formidable node.js extensions to create a simplified server that hosts my HTML page, "Poor Man's Dropbox"

2) Clients can access the server without using a terminal simply by opening up their browser and going to 127.0.0.8080/basicweb.html

3) Clients can send the server operator comments (including and, in fact, requiring that they include an email and name along with them).

4) Employs HTTP posting, and returns an HTML completion page rather than just leaving the client "out to dry" once the comment is received.

5) Logs the comments in the terminal of the QuestionGUIServer.js prompt, but also...

6) Creates a Comment Log (commentlog.txt). The log performs non-destructive append operations whenever it receives a
comment from the HTML page. Thus the log accumulates over the course of multiple runthroughs rather than being wiped each time
the server is reinitialized.

Note: More features were originally intended, but this is my first time using Node.js and it took me almost 15 hours just to figure
out the dropbox code and come up with this small add-on. I wanted to do some AJAX coding using JSONS so that I could query
for a list of the files in the dropbox and choose some to exclude, but I couldn't get it to work. I'll come to office hours
this week.

On my honor, I have neither given nor received unauthorized aid. All uses of intellectual work not my own are so noted. --LW

