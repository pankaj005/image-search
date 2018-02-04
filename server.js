// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var cors = require('cors')
// configuration ===========================================
	
// config files
var db = require('./config/db');
app.use(cors())

var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url);
mongoose.connection;
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use('/downloads', express.static('/downoads'))
// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Server started on ' + port);
exports = module.exports = app;