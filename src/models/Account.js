var crypto = require('crypto');
var mongoose = require('mongoose');

var AccountModel;
// Crypto stuff, I dunno the specifics of crypto, but these make it work
var iterations = 10000;
var saltLength = 64;
var keyLength = 64;

var AccountSchema = new mongoose.Schema({
	// A basic username
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
        match: /^[A-Za-z0-9_\-\.]{1,16}$/
	},
	
	// Some voodoo crypto stuff
	salt: {
		type: Buffer,
		required: true
	},
	
	// A basic password
	password: {
		type: String,
		required: true
	},
	
});

// AccountSchema.methods adds a method to each instantiated AccountSchema object, 
// AccountSchema.statics adds a method called like so: AccountSchema.findByUsername (I dunno what it's exactly called, but I do know the distinction)

// Returns the data in this AccountSchema in a mongo(?) friendly way
AccountSchema.methods.toAPI = function() {
	return {
		username: this.username,
		_id: this._id
	};
};

// Checks the password passed in to our password, passes 'true' to the callback if they do
AccountSchema.methods.validatePassword = function(password, callback) {
	var pass = this.password;
	
	// Crypto dark sorcery
	crypto.pbkdf2(password, this.salt, iterations, keyLength, function(err, hash) {
		if(hash.toString('hex') !== pass) {
			return callback(false);
		}
		return callback(true);
	});
};

// Checks all Accounts in AccountModel and returns the result with that username & the callback as well
AccountSchema.statics.findByUsername = function(name, callback) {
	var search = { username:name };
	return AccountModel.findOne(search, callback);
};

// Generates a hash, used to encrypt a password
AccountSchema.statics.generateHash = function(password, callback) {
	// More crypto dark sorcery
	var salt = crypto.randomBytes(saltLength);
	
	crypto.pbkdf2(password, salt, iterations, keyLength, function(err, hash){
		return callback(salt, hash.toString('hex'));
	});
};

// Attempt to, well, authenticate this user if the username as password matches
AccountSchema.statics.authenticate = function(username, password, callback) {
	return AccountModel.findByUsername(username, function (err, doc) {
		if(err) {
			return callback(err);
		}
		
		// If you don't already have a 'doc' to have passed to us, you're definitely not authentic?
		if(!doc) {
			return callback();
		}
		
		doc.validatePassword(password, function(result) {
			if(result ===true) {
				return callback(null,doc);
			}
			
			return callback();
		});
	});
};