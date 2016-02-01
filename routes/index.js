var express = require('express');
var router = express.Router();
var request = require('request');
var Stock = require('../models/stock')
var json = require('request-json');
var client = json.createClient('https://freecodecamp-stock-chart.herokuapp.com/');

var app = require('../app');


/* GET home page. */
router.get('/', function(req, res, next) {
	Stock.find({}, function(err, stocks){
		var s = stocks.map(function(stock){
			return stock.code;
		});
		if (err)
			console.log(err);

		res.render('index', {stocks: s});
	});
});

router.get('/delete/:id', function(req, res, next) {
	Stock.remove({ code: req.params.id }, function(err){
		if (err)
			console.log(err);
		app.io().emit('delete');
		res.redirect('/');
	});
});

router.post('/', function(req, res, next) {
	Stock.findOne({ code: req.body.stock.toUpperCase() }, function(err, stock) {
		if(stock == null){
			client.get('https://www.quandl.com/api/v3/datasets/WIKI/'+req.body.stock.toUpperCase()+'.json?api_key=RVVjoyPZwZGWcsCrWfGo', function (error, response, body){
				if(body.dataset) {
					console.log(body.dataset.dataset_code)
					var newStock = {
						code: body.dataset.dataset_code,
						description: body.dataset.name 
					}
					Stock.create(newStock, function(err){
						if (err)
							console.log(err);
						app.io().emit('add');
					})
					res.redirect('/');
				} else {
					res.redirect('/');
				}
			});
		} else {
			res.redirect('/');
		}
	});	
});

module.exports = router;
