var _ = require('underscore');
var models = require('../models');

var KilledServer = models.KilledServer;

var graveyardPage = function(req, res) {
	// If they're not logged in, boot 'em back to start page
	if(!req.session.account) {
		return res.redirect('/');
	}
	
	KilledServer.KilledServerModel.findByOwner(req.session.account._id, function(err, docs) {
		if(err) {
			console.log(err);
			return res.status(400).json({ error:'An error occurred' });
		}
		
		res.render('app', { graves: docs });
	});
};

var makeGrave = function(req, res) {
	// If they're not logged in, boot 'em back to start page
	if(!req.session.account) {
		return res.redirect('/');
	}
	
	if(!req.body.name || !req.body.packets) {
		return res.status(400).json({error: "Both fields required"});
	}
	
	var graveData = {
		name: req.body.name,
		packets: req.body.packets,
		killer: req.session.account._id
	};
	
	var newGrave = new KilledServer.KilledServerModel(graveData);
	newGrave.save(function(err) {
		if(err) {
			console.log(err);
			return res.status(400).json({ error:'An error occurred' });
		}
		
		res.redirect('/graveyard');
	});
};

module.exports.graveyardPage = graveyardPage;
module.exports.bury = makeGrave;