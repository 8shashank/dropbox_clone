
// var crypto = require ('crypto');

function encrypt(password){
	return password;
	// return crypto.createHash('sha1').update(password).digest('hex');
}

function isUserExists(username){
	
}

function isPasswdMatch(username,password){

}

function addUser(username,password){

}

module.exports = {
    encrypt: encrypt,
    isUserExists: isUserExists,
    isPasswdMatch: isPasswdMatch,
    addUser: addUser
}