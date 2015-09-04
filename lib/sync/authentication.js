
function Auth(){
	this.userlist = {};
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
	console.log("Server is auth user");
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