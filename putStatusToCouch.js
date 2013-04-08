var http = require('http');
var util = require('util');
var crypto = require('crypto');
var couch = require('./couch.js');

http.get('http://spaceapi.n39.eu/json', function(res) {
	var data = "";
	res.on('data', function(chunk) {
		data = data + chunk;
	});
	res.on('end', function() {
		data = JSON.parse(data);
		if(data.open) {
			util.puts("Netz39 is open");
		} else {
			util.puts("Netz39 is closed");
		}
		util.puts("Since " + (new Date(data.lastchange)).toLocaleString());
		data._id = hash(data.lastchange);
		util.puts(JSON.stringify(data));
		couch.update(data, "/space/", function() {
			res.on('data', function(dat) {
				util.puts(dat);
			});
		});
	});
}).on('error', function(err) {
	util.puts(err);
});

function hash(str) {
	var hash = crypto.createHash('sha256');
	hash.update("" + str);
	return hash.digest('hex');
};