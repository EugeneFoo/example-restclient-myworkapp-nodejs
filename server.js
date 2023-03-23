/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 Startup script for node.js server. It loads the required packages and sets message routers.
 */

// Required packages
var express = require('express');
var taskDispatcher = require('./dispatcher/taskDispatcher');
var loginDispatcher = require('./dispatcher/loginDispatcher');
var path = require('path');
var session = require('client-sessions');

// some common utilities
var respLogger = require('./common/responseLogger');
var usage = require('./common/usage');

// process the command line options
var options = usage.processArgs(path.basename(__filename));

// Modules used for communication with ServiceNow instance.
var snAuth = require('./sn_api/basicAuth');
var snTask = require('./sn_api/task');

var app = express();

// Register the authenticate and task modules to be used in dispatchers
app.set('snAuth', snAuth);
app.set('snTask', snTask);
app.set('respLogger', respLogger);
app.set('options', options);

// Register the static html folder. Browser can load html pages under this folder. 
app.use(express.static(path.join(__dirname, 'public')));

// Register the session. Secret can be an arbitrary string.
app.use(session({
    cookieName: 'session',
    secret: 'af*asdf+_)))==asdf afcmnoadfadf',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// Set up Passport 
var config = require('./config'); 
var passport = require('passport');
OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
app.use(passport.initialize());

passport.use('provider', new OAuth2Strategy({authorizationURL: config.oauth.authURL, tokenURL: config.oauth.tokenURL, clientID: config.oauth.clientID, clientSecret: config.oauth.clientSecret, callbackURL: config.oauth.callbackURL}, 
    function(accessToken, refreshToken, profile, done) {  
        var tokenInfo = {};  tokenInfo.accessToken = accessToken; tokenInfo.refreshToken = refreshToken;
         console.log(tokenInfo);
         done(null, tokenInfo); } 
));

passport.serializeUser(function(user, done) { 
    done(null, user); 
});

passport.deserializeUser(function(id, done) { 
    done(null, id); 
});

// Create our Express router
var router = express.Router();

// Register dispatchers for different types of requests. This application receives following 
// types of http requests from browser.
router.post('/login', loginDispatcher.login);
router.get('/tasks', taskDispatcher.getTasks);
router.get('/task/:taskid/comments', taskDispatcher.getComments);
router.post('/task/:taskid/comments', taskDispatcher.addComment);
router.delete('/logout', function(req, res) {
    req.session.destroy();
    res.end("Deleted");
});

// Passport Routes 
router.get('/auth/provider', passport.authenticate('provider')); 
router.get('/auth/provider/callback', passport.authenticate('provider', { 
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Register the router
app.use(router);

// Finally starts the server.
app.listen(options.port);
console.log("Server listening on: http://localhost:%s", options.port);
