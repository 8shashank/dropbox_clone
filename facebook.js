/**
 * Created by chrissu on 9/3/15.
 */
var FB = require('fb');


// Hardcoding the access token won't work since access tokens expire after a while.
// You would need to put in an OAuth request to get a new access token for the app everytime
// you run it

//FB.setAccessToken('CAACEdEose0cBAEVBgHMLSKVtWSHvxQtVXpRNyKODi3ZAyZAk9SMX8LcCM3DHlDgwJJMKdwvFY23hy9WYAep7DW0idae65JUmvYDZB1cZC81nrbqAOAjpaS7z0pia1nGBeCMRFRayLSi4dXsiLWKF5TUb5WerdkcHeu6DtrM8p2Qz47BCDmTnVMRTStkZBd5yZBoGBUnSkeZBQZDZD');


//This should work once you put in the right client id, secret and grant type
//Since the client secret is meant to be a secret, it is essential to perform this action server side
//I would move this to the sync-server if possible.
FB.api('oauth/access_token', {
    client_id: 'app_id',
    client_secret: 'app_secret',
    grant_type: 'client_credentials'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    accessToken = res.access_token;
});

var body = 'I just posted an update to my Dropbox. Check it out';
FB.api('me/feed', 'post', { message: body}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    console.log('Post Id: ' + res.id);
});