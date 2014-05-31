var   async = require('async')
	, request = require('request')
	, redis = require('redis').createClient()
	, helper = require('./helper');

baseURL = "https://api.new.livestream.com/accounts/";

exports.create = function(req,res) {

	id = req.body.livestream_id;

	//Validation Steps for Director creation
	async.waterfall(
		[
		//Check ID Against Set of Keys
		function(callback) {
			redis.sismember("accounts", id, callback); 
		},
		
		function(reply, callback){
			//Log Error if already exists in Database
			if(reply) {
				err = "Director Already Exists";
				callback(err, reply);
			}
			else {
				//Livestream API Call
				request(baseURL + id, callback);
			}
		},
		//Parse Response for fields of interest
		function(response, body, callback) {
			fields = {};
			if(response.statusCode == 200) {
				info = JSON.parse(body);
				fields = {
					livestream_id: info.id.toString(),
					full_name: info.full_name,
					dob: info.dob,
					favorite_camera: "",
					favorite_movies: []
				};
				callback(null, JSON.stringify(fields));
			}
			else if(response.statusCode == 404) {
				err = "Bad Request";
				callback(err, null);
			}		
		},
		//Create Account
		function(fields, callback) {
			redis.multi()
				.hset("account", id, fields)
				.sadd("accounts", id)
				.exec( function(err, replies) {
					if(!replies[0] || !replies[1]) {
						err = "Creation Failed";
					}
					callback(err, fields);
				}
				);
		}
		],
		//Send Response
		function(err, fields) {
			if(err) {
				res.send(400, { error: err } );
			}
			else {
				res.send(200, fields);
			}
		}
	);
};

exports.findAll = function(req, res) {
	//Get Account Values for each Key in Accounts Set
	redis.smembers("accounts", function(err, reply) {
		async.map(reply, function(reply, callback) {
			redis.hget("account", reply, callback);
		}, helper.findCallback.bind(null, res));
	});
};

exports.findById = function(req, res) {
	id = req.params.id;
	redis.hget("account", id, helper.findCallback.bind(null, res))
};



exports.update = function(req, res) {
	id = req.params.id;
	request = req.body;

	redis.hget("account", id, function(err, reply) {
		
		var info = JSON.parse(reply);

		if(!reply) {
			res.send(400, { error: "Director Not Found"});
		}
		else if(!helper.authorize(req.headers.authorization, info.full_name)) {
			res.send(401, { error: "Not Authorized"});
		}
		else {
			helper.validate(request, info, function(err) {
				if (err) {
					res.send(400, { error: err });
				}
				else {
					redis.hset("account", id, JSON.stringify(request), function(err, reply) {
						if(err) {
							res.send(400, { error: err });
						}
						else {
							res.send(200);
						}
					} );
				}
			});
		}
	});
};

exports.delete = function(req, res) {
	id = req.params.id;
	//Delete from Key Set and Hash
	redis.multi()
		.srem("accounts", id)
		.hdel("account", id)
		.exec(function(err, replies) {
			if(err) {
				res.send(400, { error: "Director Not Found" });
			}
			else if(!replies[0] || !replies[1]) {
				res.send(400, { error: "Nothing To Delete" });
			}
			else {
				res.send(200);
			}
		});
};