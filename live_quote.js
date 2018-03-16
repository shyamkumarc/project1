var express = require('express');
const https = require("https");

var app = express();
app.use( express.static(__dirname + '/dist'));
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
				if (d){
				process.stdout.write(d);
				var data = JSON.parse(d);
				var desired_index = 0;
				for (let index = 0; index < data.length; index++) {
					if (data[index].matchtype === "exact") {
						//exit from loop;
						desired_index = index;
						break ;

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
					var value = data.bseNseJson[0].closePrice;
		}		);	});		
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



app.get('/tagId/:id', function(request,response){
	var tagId = request.params.id;
	if (tagId) {
		options = {
			   host: 'json.bselivefeeds.indiatimes.com',
			   //   port: '443',
			   method: 'GET',
			   path: '/ET_Community/companypagedata?companyid=' + tagId ,//data[desired_index].tagId,
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
}		);	});		
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

