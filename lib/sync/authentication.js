
var fs = require('fs');

function Auth(filePath){
	this.filePath = filePath;
	this.userlist = {};

	try{
		var credentials = fs.readFileSync(this.filePath, 'utf8');
		this.userlist = JSON.parse(credentials);
	}
	catch(e){
		if (e.code === 'ENOENT')
		{	// File not found
			fs.writeFile(this.filePath, this.userlist,
				function (err)
				{
					if (err) throw "Cannot create the file to store credentials";
	  				console.log("Create a file to store credentials.");
				});
		}
		else
		{
			throw "File storing credentials are corrupted.";
		}
	}
}

Auth.prototype.isUserExists = function(username)
{
	return (username in this.userlist)
}

Auth.prototype.addUser = function(username, password)
{
	if(this.isUserExists(username))
	{
		return false;
	}

	this.userlist[username] = password;

	fs.writeFile(this.filePath, JSON.stringify(this.userlist),
		function (err)
		{
			if (err) throw "Cannot save new user: " + username + " to local file storing credentials";
	  		console.log("A new user: " + username + " is created.");
		});
	
	return true;
}

Auth.prototype.isPasswdMatch = function(username,password)
{
	if(!this.isUserExists(username))
	{
		return false;
	}
	return (this.userlist[username] === password);
}

Auth.prototype.authUser = function(username,password){
	if(this.isUserExists(username))
	{
		return this.isPasswdMatch(username,password);
	}
	else
	{
		return this.addUser(username,password);
	}
}

module.exports = {
    Auth: Auth
}