var ingredients = ['kale',]

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

$.ajax({
	url: 'https://api.edamam.com/search?q=' + ingredients + '&app_id=b8fa8ec0&app_key=2e99e135530eaed01cb9620b24c1f1c0'
}).then(function(response) {
	console.log(response);
	console.log(response.hits);
	console.log(response.hits[0]);
	console.log(response.hits[0].recipe);
	console.log(response.hits[0].recipe.ingredientLines);
	console.log(response.hits[0].recipe.digest);
	console.log(response.hits[0].recipe.calories);
	console.log(response.hits[0].recipe.yield)
	console.log((response.hits[0].recipe.calories)/(response.hits[0].recipe.yield))
	var intCalories = (response.hits[0].recipe.calories)/(response.hits[0].recipe.yield);
	var calories = (Math.floor(intCalories));
	console.log(calories);
	console.log(response.hits[0].recipe.totalNutrients);
	console.log(response.hits[0].recipe.totalNutrients.FAT);
	console.log(response.hits[0].recipe.label);

	var results = response.hits;
	console.log(results.length);
	for (i = 0; i < results.length; i++) {
		var intCalories = (results[i].recipe.calories)/(results[i].recipe.yield);
		var calories = (Math.floor(intCalories));
		var recipeDiv = $('<div>');
		var recipeImage = $('<img>');
		var recipeCaption = $('<div>');
		var recipeBtnDiv = $('<div>');
		var caloriesP = $('<p>');
		recipeCaption.addClass('caption');
		recipeCaption.append($('<h3>').text(results[i].recipe.label));
		recipeCaption.addClass('text-center');
		caloriesP.text(calories + ' calories per serving');
		recipeCaption.append(caloriesP)
		recipeBtnDiv.append($('<a>').append($('<button>').addClass('btn').text('Go to recipe')).attr('href',results[i].recipe.url).attr('target','_blank'));
		recipeBtnDiv.append($('<button>').text('Activity').addClass('btn'));
		recipeCaption.append(recipeBtnDiv);
		recipeImage.attr('src', results[i].recipe.image);
		recipeDiv.addClass('thumbnail col-md-4 recipe');
		recipeDiv.append(recipeImage);
		recipeDiv.append(recipeCaption);
		$('#recipeDisplay').append(recipeDiv);

	}

	var restaurantchoice;
	var streetaddress = "";
	var city = "";
	var state = "";
	var zipcode = "75225";
	streetaddress = streetaddress.replace(/\s+/g, '');
	//ADDRESS EXAMPLE: https://maps.googleapis.com/maps/api/place/textsearch/json?query=grocery+stores+in+streetnumber+streetname+ave+city+state&radius=1&key=AIzaSyC10w2038KqjWrYLulCTPIC3RNqTMd9g74
	
	//https://maps.googleapis.com/maps/api/place/textsearch/json?query=grocery+stores+in+zipcode&radius=1&key=AIzaSyC10w2038KqjWrYLulCTPIC3RNqTMd9g74

	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=grocery+stores+in+' + zipcode + '&radius=1&key=AIzaSyC10w2038KqjWrYLulCTPIC3RNqTMd9g74'
	}).then(function(response) {
		console.log(response);
		console.log(response.results);
		console.log(response.results[0].geometry.location);
		restaurantchoice = response.results[0].geometry.location;

var map;
var infowindow;

	var dallasGrocery = restaurantchoice;

	map = new google.maps.Map(document.getElementById('map'), {
	center: dallasGrocery,
	zoom: 20
	});

	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
	location: dallasGrocery,
	radius: 2,
	type: ['store']
	}, callback);
})
});

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
	for (var i = 0; i < results.length; i++) {
		createMarker(results[i]);
	}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
	map: map,
	position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
	infowindow.setContent(place.name);
	infowindow.open(map, this);
	});
}