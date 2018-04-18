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
	for (i = 0; i < 5; i++) {
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
		recipeBtnDiv.append($('<a>').append($('<button>').addClass('btn btn-primary btn-sm').text('Go to recipe')).attr('href',results[i].recipe.url).attr('target','_blank'));
		recipeBtnDiv.append($('<button>').text('Activity').addClass('btn btn-primary btn-sm btnSpace'));
		recipeCaption.append(recipeBtnDiv);
		recipeImage.attr('src', results[i].recipe.image);
		recipeDiv.addClass('thumbnail col-md-4 recipe');
		recipeDiv.append(recipeImage);
		recipeDiv.append(recipeCaption);
		$('#recipeDisplay').append(recipeDiv);
	}})

		var streetAddress = "";
		var city = "";
		var state = "";
		var groceryChoice;
		var groceryStoresArray = [];
		var centerArray = [];
		var positionArray = [];
		var groceryNameArray = [];
		var groceryInfoObject = {name:[], address:[], ID:[]};
		var addressEdit = [];
		var infoArray = [];
		var infoURL;
		var chosenGroceryName;

		$("#map").hide();

	$(".zipbutton").on( "click", function() {
		zipCode = $(".zipinput").val().trim();
		$("#map").show();
		groceryStoresArray = [];
		centerArray = [];
		positionArray = [];
		groceryInfoObject = {name:[], address:[], url:[]};

$.ajax({
	url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=grocery+stores+in+' + zipCode + '&radius=1&key=AIzaSyC10w2038KqjWrYLulCTPIC3RNqTMd9g74'
}).then(function(response) {

	for (i = 0; i < 9; i++){
		var groceryChoice = response.results[i].geometry.location;
		var groceryName = response.results[i].name;
		groceryInfoObject.name.push(groceryName);
		var groceryAddress = response.results[i].formatted_address;
		groceryInfoObject.address.push(groceryAddress);
		addressEdit = groceryAddress.split(/[ ,]+/).join("+");
		groceryInfoURL(addressEdit);
		groceryInfoObject.url.push(infoURL);
		// var groceryID = response.results[i].place_id;
		// groceryInfoObject.ID.push(groceryID);
		var groceryString = JSON.stringify(groceryChoice);
		var groceryStores = groceryString.replace(/"/g,'').replace(/lat/g, '').replace(':', '').replace(/lng/g, ' ').replace(/""/g, '').replace(/:/g, '').replace(/{/g, '').replace(/}/g, '');
		groceryStoresArray.push(groceryStores)
		var commaPos = groceryStores.indexOf(',');
		var coordinatesLat = parseFloat(groceryStoresArray[i].substring(0, commaPos));
		var coordinatesLong = parseFloat(groceryStoresArray[i].substring(commaPos + 1, groceryStoresArray[i].length));
		var centerPoint = new google.maps.LatLng(coordinatesLat, coordinatesLong);
		var position = new google.maps.LatLng(coordinatesLat, coordinatesLong);
		centerArray.push(centerPoint);
		positionArray.push(position);
		initMap(positionArray, groceryInfoObject)}
	})})

	function groceryInfoURL(address) {
		infoURL = "https://www.google.com/maps/dir/?api=1&destination=" + address + "&travelmode=walking";
	}

	function initMap(){
	var map;
	var infowindow;

	var map = new google.maps.Map(document.getElementById("map"), {
	zoom: 13,
	center: positionArray[0],
	mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	var infowindow = new google.maps.InfoWindow({});

	var marker, i;

	for (i = 0; i < 9; i++) {

		marker = new google.maps.Marker({
			position: positionArray[i],
			map: map
	});

	google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
		chosenGroceryName = groceryInfoObject.name[i];
		infowindow.setContent('<div id="groceryinfo"><strong>' + groceryInfoObject.name[i] + '</strong><br>' +
		groceryInfoObject.address[i] + '<br>' + '<a href=' +  groceryInfoObject.url[i] + ' target="_blank">' + "Burn off that meal" + "</a>" + '<br></div>')

		infowindow.open(map, marker);
	
	
		var origin1 = positionArray[i];
		var destinationA = groceryInfoObject.address[i];
		console.log(destinationA);
		var service = new google.maps.DistanceMatrixService;
		service.getDistanceMatrix({
		origins: [origin1],
		destinations: [destinationA],
		travelMode: 'WALKING',
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: true,
		}, function(response, status) {
		if (status !== 'OK') {
			alert('Error was: ' + status);
		} else {
			var originList = response.originAddresses;
			console.log(response);
			var destinationList = response.destinationAddresses;
			var outputDiv = document.getElementById('output');
			outputDiv.innerHTML = '';

			var showGeocodedAddressOnMap = function(asDestination) {
			var icon = asDestination ? destinationIcon : originIcon;
			return function(results, status) {
				if (status === 'OK') {
				map.fitBounds(bounds.extend(results[0].geometry.location));
				markersArray.push(new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon: icon
				}));
				} else {
				alert('Geocode was not successful due to: ' + status);
				}
			};
			};

			for (var i = 0; i < originList.length; i++) {
			var results = response.rows[i].elements;
			for (var j = 0; j < results.length; j++) {
				outputDiv.innerHTML += outputDiv.innerHTML += 'Pick up all your ingredients at ' + chosenGroceryName + `! If you walk, you can burn off this delish meal since it will take you about ` + results[j].distance.text + `, or ` + results[j].duration.text + `, to get there! GET MOVIN'!`;
			}}}});

	
	}
	}
	)(marker, i));
		
	}
	}



