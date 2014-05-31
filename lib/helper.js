var crypto = require('../node_modules/crypto/md5')
	, _ = require('lodash');

//Handles Callback of Find Requests
exports.findCallback = function(res, err, result) {
	if(err || !result) {
		res.send(400, { error: "Not Found" });
	}
	else {
		res.send(200, result);
	}
};

//Validates Director Creation
exports.validate = function(newValues, oldValues, callback) {
	err = null;
	if(newValues.full_name !== oldValues.full_name || newValues.dob !== oldValues.dob) { 
		err = "Cannot Update That Field";
	}
	else {
		for(i in newValues) {
			if(newValues.hasOwnProperty(i)) {
				//Type Checking
				if(typeof newValues[i] !== typeof oldValues[i]) {
					err = "Invalid Input";
				}
				//Array of Movies Type Check
				if(typeof newValues[i] == "object") {
					_.forEach(newValues[i], function(val) {
						if(typeof val !==  "string") {
							err = "Type Mismatch";
						}
					});
				}
			}
		}
	}

	callback(err);

};

//Authorizes Director Attribute Update
exports.authorize = function(bearer, full_name) {
	if(bearer.split(' ')[1]) {
		if(bearer.split(' ')[1] === crypto.hex_md5(full_name)) {
			return true;
		}
	}
	else {
		return false;
	} 
};