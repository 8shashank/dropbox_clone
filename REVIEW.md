Review of Thomas Miesel by Kevin Liu
Overview

This code uses mysql as a backend database to house user login info¡¯s. It has a data base (user) where it stores and adds in new user info. The code has functions to check for and add users to the database. The creator added in a new javascript file db.js to house these new functions. The creator has a function that prompts the user at the command line if he/she wants to login or create a new login, and has a built in check to make sure that there is no overlap of users. A lot of the semantics of the code breaks down check if ¡°user entered info¡± == an entry in the db. Return true/false and go from there. 

Suggested Improvements
1.	Comments: It wasn¡¯t too hard to follow the code, but comments would make it easier to read¡¯
2.	I can¡¯t seem to edit login.js but there are several places(lines 24, 28, 30 where you replace == with ===. The one¡¯s all saw all had the same types on both sides of the equality, but I¡¯m still a scrub at javascript so maybe there might be a place where === will give you a bit faster run time than ==.
3.	Changed if (err) throw ¡°err¡± to if (err) { return next(err); } to allow for exceptions to be raised and still get caught by error handling pipline. 
4.	Reformatted some of the code in db.js so it looks better.
5.	

