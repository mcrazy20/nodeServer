exports.result = function(req, res){
	//Various keys to access the twitter API
	var twit = new twitter({
	  consumer_key: 'wqERQjyGsZNzWZdbd9P6w',
	  consumer_secret: 'l96ZBvNhjtbHx8j7npVBZNu5zzOwGPB386wdHtdxr0',
	  access_token_key: '1924673076-cgs9Y6VPcNMs09fjjLFoDWd1BS2LqU1DBFiAML8',
	  access_token_secret: 'KdQXA1r3gVpqNnfy5uiHTNGGrf9sz5IeHXlNMwPVgCAsc'
	});

	//Used for Geocoder
	var extra = {
		apiKey: 'AIzaSyCrOEigI-IexXXjOM7SAGKH2u8I9CAB05s'
	};

	//Allows us to get the Lat/Long of a location
	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	var ig = require('instagram-node').instagram();
	//Keys for instagram API
	ig.use({ client_id: 'fbc6b586a2f24eeb8876360c872a8f65',
         client_secret: '2f4ba206c6b34c41a8676333324a1237' });
	eocoder.geocode(req.body.location, function(err, res){
		if (err)
			console.log(err);
		var location = (res[0]['longitude'] + ',' + (res[0]['latitude'] - .2) + ',' + (parseFloat(res[0]['longitude'])
		 + parseFloat(.2)) + ',' + (parseFloat(res[0]['latitude']) + parseFloat(.2));
		var loc = {};
		loc.lat = parseFloat(res[0]['latitude']);
		loc.lng = parseFloat(res[0]['longitude']);

		ig.media_search(loc.lat, loc.lng, 3500, function(err, medias, limit){
			if (err)
				console.log(err);
			console.log(medias);
		});

		twit.search(req.body.location, {}, function(err, data){

		});
	res.render('result', { title: 'Express' });
});