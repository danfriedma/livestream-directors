var http = require('http')
	, express = require('express')
	, bodyParser = require('body-parser')
	, accounts = require('./lib/accounts')
	, app = express()
	, port = 5000;


//Middleware
app.use(bodyParser.json());

//Routes
app.get('/accounts', accounts.findAll);
app.get('/accounts/:id', accounts.findById);
app.post('/accounts', accounts.create);
app.post('/accounts/:id', accounts.update);
app.delete('/accounts/:id', accounts.delete);

//Express Server
var server = http.createServer(app)
server.listen(port);

module.exports = app;