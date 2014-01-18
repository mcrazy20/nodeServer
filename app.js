
/**
 * Module dependencies.
 */


var url = require('url');
var twitter = require('ntwitter');
var geocoderProvider = 'openstreetmap';
var httpAdapter = 'http';



var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/result', routes.index);
var i = 0;

app.post('/', function(req, res){
	var twit = new twitter({
	  	consumer_key: 'wqERQjyGsZNzWZdbd9P6w',
	  	consumer_secret: 'l96ZBvNhjtbHx8j7npVBZNu5zzOwGPB386wdHtdxr0',
	  	access_token_key: '1924673076-cgs9Y6VPcNMs09fjjLFoDWd1BS2LqU1DBFiAML8',
	  	access_token_secret: 'KdQXA1r3gVpqNnfy5uiHTNGGrf9sz5IeHXlNMwPVgCAsc'
	});

	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

	var ig = require('instagram-node').instagram();

	var extra = {
		apiKey: 'AIzaSyCrOEigI-IexXXjOM7SAGKH2u8I9CAB05s'
	};
	ig.use({ client_id: 'fbc6b586a2f24eeb8876360c872a8f65',
         client_secret: '2f4ba206c6b34c41a8676333324a1237' });
	var instagramPosts= [];
	var twitterPosts = [];
	geocoder.geocode(req.body.location, function(err, res){
		if (err)
			console.log(err);

		//Giving a range to search for Twitter. Unfortunately the Twitter api doesn't allow you to use a radius when searching for geotagged tweets
		var location = (res[0]['longitude'] - .2) + ',' + (res[0]['latitude'] - .2) + ',' + (parseFloat(res[0]['longitude'])
		 + parseFloat(.2)) + ',' + (parseFloat(res[0]['latitude']) + parseFloat(.2));

		//Searching for instagram pictures
		var loc = {};
		loc.lat = parseFloat(res[0]['latitude']);
		loc.lng = parseFloat(res[0]['longitude']);

		//This function uses Latitude, Longitude, and a Distance and returns a list of pictures
		ig.media_search(loc.lat, loc.lng, 3500, function(err, medias, limit){
			if (err)
				console.log(err);
			//console.log(medias);
			
				for (i = 0; i<10; i++)
				{
					if (medias[i].caption != null && medias[i].caption.text != null)
					{
						
						instagramPosts[i] = {text: medias[i].caption.text, link: medias[i].link}
					}
				}
			console.log(instagramPosts);
			//res.render('result.jade', {'instagramPosts' : instagramPosts, 'twitterPosts' : twitterPosts});
			//res.render('result.jade', {'instagramPosts' : instagramPosts});
				
			
		});
		//This is the twitter stream.
		
		twit.stream('statuses/filter', {'locations': location}, function(stream) {
	  		stream.on('data', function (data) {
	    	//console.log(data)
	    			
	    			if (data.text != null && i < 6)
	    			{
	  					twitterPosts[i] = {text: data.text};
	  					i++;
	  				}
	  			
	    		});

	  		
	  		stream.on('error', function(response){
	  			console.log(response);
	  		});
	  		stream.on('destroy', function(response){
	  			console.log(response);
	  		});
	  		setTimeout(stream.destroy, 5000);
	  	});

	});
	//res.render('result.jade', {'instagramPosts' : instagramPosts, 'twitterPosts' : twitterPosts});
	//res.render('result.jade', instagramPosts);
	//, twitterPosts
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

});


