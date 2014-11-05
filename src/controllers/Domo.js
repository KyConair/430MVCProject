var _ = require('underscore');

var models = require('../models');

var Domo = models.Domo;

var makerPage = function(req, res) {
	if(!req.session.account) {
		return res.redirect('/');
	}
	
	Domo.DomoModel.findByOwner(req.session.account._id, function (err, docs) {
		if(err) {
			console.log(err);
			return res.status(400).json({error: "An error occured."});
		}
		
		res.render('app', {domos: docs});
	});
};

var makeDomo = function(req, res) {
	if(!req.session.account) {
		return res.redirect('/');
	}
	
	if(!req.body.name || !req.body.age) {
		return res.status(400).json({error: "RAWR! Both fields required!"});
	}
	
	var domoData= {
		name: req.body.name,
		age: req.body.age,
		owner: req.session.account._id
	};
	
	var newDomo = new Domo.DomoModel(domoData);
	newDomo.save(function(err) {
		if(err) {
			console.log(err);
			return res.status(400).json({error: "something broke"});
		}
		
		res.json({redirect: '/maker'});
	});
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;