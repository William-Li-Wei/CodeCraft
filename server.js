/**
 * Created by william on 26.03.15.
 */

var express = require('express'),
    http = require('http'),
    protectJSON = require('./lib/protectJSON'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    compression = require("compression"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    fs = require('fs'),

    config = require('./config.js');

var app = express();
var accessLogStream = fs.createWriteStream('./codecraft.log', {flags: 'a'});

/***** Server set up *****/
app.use(express.static(config.server.distFolder));                              // serve application files
app.use(config.server.staticUrl, express.static(config.server.distFolder));     // serve static files
app.use(favicon(config.server.distFolder + '/favicon.png'));                    // serve favicon
app.use(protectJSON);                                                           // apply JSON protection
app.set('port', config.server.listenPort);                                      // set up port number
app.set('securePort', config.server.securePort);                                // set up secure port number
app.use(morgan('combined', {stream: accessLogStream}))                          // set up logger
app.use(compression());                                                         // apply compression to all request
app.use(config.server.staticUrl, compression());                                // apply compression to static files
app.use(bodyParser.json());                                                     // set up JSON paser
app.use(methodOverride());                                                      // overwrite request header
app.use(cookieParser(config.server.cookieSecret));                              // set up cookie paser with secrets
// provide guests sessions
app.use(cookieSession({name: config.server.cookieName, secret: config.server.cookieSecret}));

app.use(function(req, res, next) {
    var t="[" + new Date().toUTCString() + "]";
    if (req.user) {
        console.log(t, "- Current User:", req.user.username);
    } else {
        console.log(t, "- Unauthenticated");
    }
    next();
});

// Handle unmatched api
app.get('/api/*', function(req, res) {
    console.log('unknown api');
    res.json(400, 'bad request');
});

app.get('/*',function(req, res) {
    res.sendfile('index.html', { root: config.server.distFolder });
});

// Start server
http.createServer(app).listen(config.server.listenPort, config.server.ip, function() {
    console.log("Code Craft - listening on port " + config.server.listenPort);
});