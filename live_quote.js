const express = require('express');
const https = require("https");
const mongodb = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));
// app.use(express.bodyParser());
const MongoClient = require('mongodb').MongoClient;
var gdatabase;
// const MONGO_URL = 'mongodb://shyam:skc909@ds213229.mlab.com:13229/shyamdb';

const MONGO_URL = 'mongodb://shyam2:skc9092@ec2-34-207-198-139.compute-1.amazonaws.com:27017/shyamdb';



app.get('/quotes', function (request, response) {
	if (!gdatabase) {
			MongoClient.connect(MONGO_URL, (err, database) => {
				if (err) {
					return console.log(err);
				}
				gdatabase = database;
				var mydb = database.db("shyamdb");
				// Do something with db here, like inserting a record
				mydb.collection('Quotes').find({}).toArray(function (err, docs) {
					// assert.equal(err, null);
					console.log("Found the following records");
					console.log(docs)
					response.send(docs);
					// database.close();
				});
			})

	
	}
	else {
		if (gdatabase.isConnected()) {
		var mydb = gdatabase.db("shyamdb");
		mydb.collection('Quotes').find({}).toArray(function (err, docs) {
			// assert.equal(err, null);
			console.log("Found the following records");
			console.log(docs)
			response.send(docs);
		});
	}
	}
});
app.post('/quotes', function (request, response) {
	if (!gdatabase) {

			MongoClient.connect(MONGO_URL, (err, database) => {
				if (err) {
					return console.log(err);
				}
				var mydb = database.db("shyamdb");
				// Do something with db here, like inserting a record
				mydb.collection('Quotes').insertOne(
					request.body,
					function (err, res) {
						if (err) {
							database.close();
							console.log(err);
						}
						//    res.insertedId.toString();
						var result = request.body;
						result._id = res.insertedId.toString();
						response.send(result);

						// Success
						database.close();
					}
				)
			});
	}
	else {
		if (gdatabase.isConnected()) {
		var mydb = gdatabase.db("shyamdb");
		mydb.collection('Quotes').insertOne(
			request.body,
			function (err, res) {
				if (err) {
					database.close();
					console.log(err);
				}
				//    res.insertedId.toString();
				var result = request.body;
				result._id = res.insertedId.toString();
				response.send(result);

				// Success
			}
		)}
	}

});
app.delete('/quotes/', function (request, response) {
	if (request.query.id && request.query.id.length > 0) {
		if (!gdatabase) {

				MongoClient.connect(MONGO_URL, (err, database) => {
					if (err) {
						return console.log(err);
					}
					var mydb = database.db("shyamdb");
					// Do something with db here, like inserting a record
					mydb.collection('Quotes').deleteOne({ _id: new mongodb.ObjectID(request.query.id) }, function (err, result) {
						// assert.equal(err, null);
						// assert.equal(1, result.result.n);
						if (err) {
							response.sendStatus(500);
							// response.render('error', { error: err });
						}
						else {
							response.send({ status: 'Deleted' });
							// response.sendStatus(200);
							// response.render('success', { error: err })
						}
						console.log("Removed the document with the field a equal to 3");
						// callback(result);
					});
				});
			
		}
		else {
			if (gdatabase.isConnected()) {
			var mydb = gdatabase.db("shyamdb");
			mydb.collection('Quotes').deleteOne({ _id: new mongodb.ObjectID(request.query.id) }, function (err, result) {
				// assert.equal(err, null);
				// assert.equal(1, result.result.n);
				if (err) {
					response.sendStatus(500);
					// response.render('error', { error: err });
				}
				else {
					response.send({ status: 'Deleted' });
					// response.sendStatus(200);
					// response.render('success', { error: err })
				}
				console.log("Removed the document with the field a equal to 3");
				// callback(result);
			});
		}
	}


	}
});
app.put('/quotes', function (request, response) {
	if (!gdatabase) {

			MongoClient.connect(MONGO_URL, (err, database) => {
				if (err) {
					return console.log(err);
				}
				var mydb = database.db("shyamdb");
				// Do something with db here, like inserting a record
				mydb.collection('Quotes').updateOne({ _id: new mongodb.ObjectID(request.body._id) }
					, {
						$set: {
							profit_ptg: request.body.profit_ptg,
							loss_ptg: request.body.loss_ptg,
							buyPrice : request.body.buyPrice
						}
						// 	 Name: 'Infosys',
						// openPrice: '90',
						// lastTradedPrice: '100',
						// profit_alert : '15',
						// loss_alert : '5' } 
					}, function (err, result) {
						// assert.equal(err, null);
						// assert.equal(1, result.result.n);
						response.send({ status: 'updated' });
						console.log("Updated the document with the field a equal to 2");
						// callback(result);
					})
			});
	}
	else {
		if (gdatabase.isConnected()) {
		var mydb = gdatabase.db("shyamdb");
		mydb.collection('Quotes').updateOne({ _id: new mongodb.ObjectID(request.body._id) }
			, {
				$set: {
					profit_ptg: request.body.profit_ptg,
					loss_ptg: request.body.loss_ptg,
					buyPrice : request.body.buyPrice
				}
				// 	 Name: 'Infosys',
				// openPrice: '90',
				// lastTradedPrice: '100',
				// profit_alert : '15',
				// loss_alert : '5' } 
			}, function (err, result) {
				// assert.equal(err, null);
				// assert.equal(1, result.result.n);

				response.send({ status: 'updated' });
				console.log("Updated the document with the field a equal to 2");
				// callback(result);
			})
		}
 
	}

});

app.get('/request/', function (request, response) {
	if (request.query.symbol && request.query.symbol.length > 0) {
		console.log("Symbol Requested - " + request.query.symbol);

		var http = require('http');

		var symbol = request.query.symbol;
		var options = {
			host: 'etsearch.indiatimes.com',
			//   port: '443',
			method: 'GET',
			path: '/etspeeds/ethome.ep?ticker=' + request.query.symbol + '&matchCompanyName=true&outputtype=json',
			headers: {
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
				// "Referer": "http://www.nseindia.com/",
				"Accept": '*/*'
			}
		};

		var resp = "";	// Hold the servers response

		const req = https.request(options, (res) => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);

			res.on('data', (d) => {
				if (d) {
					process.stdout.write(d);
					var data = JSON.parse(d);
					var desired_index = 0;
					for (let index = 0; index < data.length; index++) {
						if (data[index].matchtype === "exact") {
							//exit from loop;
							desired_index = index;
							break;

						}
					}
					response.send(data);
					if (data && desired_index) {
						options = {
							host: 'json.bselivefeeds.indiatimes.com',
							//   port: '443',
							method: 'GET',
							path: '/ET_Community/companypagedata?companyid=' + data[desired_index].tagId,
							headers: {
								"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
								// "Referer": "http://www.nseindia.com/",
								"Accept": '*/*'
							}
						};

						var resp = "";	// Hold the servers response

						const req = https.request(options, (res2) => {
							console.log('statusCode:', res2.statusCode);
							console.log('headers:', res2.headers);

							res2.on('data', (d) => {
								process.stdout.write(d);
								var data = JSON.parse(d);
								var desired_index;
								var value = data.bseNseJson[1].closePrice;
							});
						});
						req.on('error', (e) => {
							console.error(e);
						});
						req.end();
					}
				}
			});
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.end();

		req.end();
	} else {
		// Invalid request
		response.send(invalidRequest(), 400);
	}
});



app.get('/tagId/:id', function (request, response) {
	var tagId = request.params.id;
	if (tagId) {
		options = {
			host: 'json.bselivefeeds.indiatimes.com',
			//   port: '443',
			method: 'GET',
			path: '/ET_Community/companypagedata?companyid=' + tagId,//data[desired_index].tagId,
			headers: {
				"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
				// "Referer": "http://www.nseindia.com/",
				"Accept": '*/*'
			}
		};

		var resp = "";	// Hold the servers response

		const req = https.request(options, (res2) => {
			console.log('statusCode:', res2.statusCode);
			console.log('headers:', res2.headers);

			res2.on('data', (d) => {
				process.stdout.write(d);
				var data = JSON.parse(d);
				//    var desired_index;
				//    var value = data.bseNseJson[0];
				response.send(data.bseNseJson[0]);
			});
		});
		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});

function invalidRequest() {
	return "INVALID REQUEST";
}

//test

