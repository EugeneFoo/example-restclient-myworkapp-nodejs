config = {};

config.instanceURL = 'https://xxxx.service-now.com/';

// OAuth Configuration 
config.oauth = {}; 
config.oauth.clientID = 'xxxx'; 
config.oauth.clientSecret = 'xxxx'; 
config.oauth.authURL = config.instanceURL + '/oauth_auth.do'; config.oauth.tokenURL = config.instanceURL + '/oauth_token.do'; config.oauth.callbackURL = 'http://localhost:3000/auth/provider/callback';

module.exports = config;