// set up ======================================================================
var express  = require('express');
var nodemailer = require('nodemailer');
var app      = express();                               // create our app w/ express
////var mongoose = require('mongoose');                     // mongoose for mongodb
//var port     = process.env.PORT || 8080;                // set the port
//var server_port = process.env.PORT || 5000;
app.set('port', (process.env.PORT || 5000));
//var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
//var database = require('./config/database');            // load the database config
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration ===============================================================
//mongoose.connect(database.url);     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.kv-group-ups+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
//app.listen(server_port, function(){
//    console.log("Listening on server_port " + server_port)
//});
//console.log("App listening on port " + port);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});