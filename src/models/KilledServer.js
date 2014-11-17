var mongoose = require('mongoose');
var _ = require('underscore');

var KilledServerModel;

var setName = function(name) {
	return _.escape(name).trim();
};

var KilledServerSchema = new mongoose.Schema({
	// The name of the server that the player MURDERED
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
    },
	
	// The number of packets the server handled before it died
	packets: {
		type: Number,
		min: 0,
		requires: true
	},
	
	// The ID of the Account that killed this server
	killer: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	}
});

// Returns the data in this KilledServerSchema in a mongo(?) friendly way
KilledServerSchema.methods.toAPI = function() {
	return {
		username: this.username,
		packets: this.age
	};
};

KilledServerSchema.statics.findByOwner = function(ownerId, callback) {
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return KilledServerModel.find(search).select("name packets").exec(callback);
};

KilledServerModel = mongoose.model('KilledServer', KilledServerSchema);

module.exports.KilledServerModel = KilledServerModel;
module.exports.KilledServerSchema = KilledServerSchema;
