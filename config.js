config = {};

config.instanceURL = 'https://dev19907.service-now.com/';

// OAuth Configuration 
config.oauth = {}; 
config.oauth.clientID = '49fc567c27fd211056026e1c64b53407'; 
config.oauth.clientSecret = 'qs+E,i#s?E'; 
config.oauth.authURL = config.instanceURL + '/oauth_auth.do'; config.oauth.tokenURL = config.instanceURL + '/oauth_token.do'; config.oauth.callbackURL = 'http://localhost:3000/auth/provider/callback';

module.exports = config;