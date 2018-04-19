var ingredients = [];

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

$(document).ready(function(){
    $('.modal').modal();
  });


function displayRecipes() {
	$.ajax({
		url: 'https://api.edamam.com/search?q=' + ingredients + '&app_id=b8fa8ec0&app_key=2e99e135530eaed01cb9620b24c1f1c0'
	}).then(function(response) {
		
		var intCalories = (response.hits[0].recipe.calories)/(response.hits[0].recipe.yield);
		var calories = (Math.floor(intCalories));
		var results = response.hits;

		$('#recipeDisplay').html('');

		for (i = 0; i < results.length; i++) {
			var intCalories = (results[i].recipe.calories)/(results[i].recipe.yield);
			var calories = (Math.floor(intCalories));
			var recipeDiv = $('<div>');
			var recipeImage = $('<img>');
			var recipeCaption = $('<div>');
			var recipeBtnDiv = $('<div>');
			var caloriesP = $('<p>');
			recipeCaption.addClass('caption');
			recipeCaption.append($('<div>').text(results[i].recipe.label).addClass('recipeName'));
			recipeCaption.addClass('text-center');
			caloriesP.text(calories + ' calories per serving');
			recipeCaption.append(caloriesP)
			recipeBtnDiv.append($('<a>').append($('<button>').addClass('btn recipeBtn').text('Go to recipe')).attr('href',results[i].recipe.url).attr('target','_blank'));
			var activityBtn = $('<button>').text('Activity').addClass('btn');
			recipeBtnDiv.append(activityBtn);
			recipeCaption.append(recipeBtnDiv);
			recipeImage.attr('src', results[i].recipe.image);
			recipeDiv.addClass('thumbnail col-md-4 recipe');
			recipeDiv.append(recipeImage);
			recipeDiv.append(recipeCaption);
			$('#recipeDisplay').prepend(recipeDiv);

			if (calories < 50) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal1');
			} else if (calories >= 50 && calories <= 100) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal2');
			} else if (calories > 100 && calories < 300) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal3');
			} else if (calories >= 300 && calories < 500) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal4');
			} else if (calories >= 500 && calories < 750) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal5');
			} else if (calories >= 750 && calories < 1000) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal6');
			} else if (calories >= 1000 && calories < 2000) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal7');
			} else if (calories >= 2000) {
				activityBtn.addClass('modal-trigger').attr('href', '#modal8');
			};
		};
		$('#numIngredients').html(ingredients.length);
		for (var j = 0; j < ingredients.length; j++) {
			var ingredientDiv = $('<div>').text(ingredients[j]).addClass('currentIngredient');
			var ingredientClose = $('<button>').text('X').addClass('ingredientListBtn btn').attr('name', ingredients[j]);
			ingredientDiv.append(ingredientClose);
			$('#ingredients-list').prepend(ingredientDiv);
		};
	});
};

$('#ingredientsSearchBtn').on('click', function(event){
	event.preventDefault();
	var ingredient = $('#ingredientsSearchBar').val().trim();
	var ingredientStr = String(ingredient);

	ingredients.push(ingredient);
	$('#ingredientsSearchBar').val('');
	$('#ingredients-list').empty();
	displayRecipes();
	console.log(ingredients);
});

$(document).on('click', '.ingredientListBtn', function() {
	var search_term = this.name;

	for (var i=ingredients.length-1; i>=0; i--) {
    	if (ingredients[i] === search_term) {
        ingredients.splice(i, 1);
         break;      
    	};
	};
	console.log(ingredients)
	$('#ingredients-list').empty();
	$('#recipeDisplay').empty();
	if (ingredients.length >= 1) {
	displayRecipes();
	} else {
		$('#numIngredients').html('0');
		var recipeBckGound = $('<img>').attr('src', 'images/MainPic.jpg').addClass('recipeDisplayBckGround img-responsive');
		$('#recipeDisplay').append(recipeBckGound);
	};
});

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
		event.preventDefault();
		
		// $(".zipinput").keyup(function(event) {
		// 	if (event.keyCode == 13) {
		// 	  $(".zipbutton").click();
		// 	}
		//   });

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

	function locate(){
		if ("geolocation" in navigator){
			navigator.geolocation.getCurrentPosition(function(position){ 
				var currentLatitude = position.coords.latitude;
				var currentLongitude = position.coords.longitude;
				var infoWindowHTML = "Latitude: " + currentLatitude + "<br>Longitude: " + currentLongitude;
				var infoWindow = new google.maps.InfoWindow({map: map, content: infoWindowHTML});
				var currentLocation = { lat: currentLatitude, lng: currentLongitude };
				infoWindow.setPosition(currentLocation);
			});}}


	google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
	
		chosenGroceryName = groceryInfoObject.name[i];
		infowindow.setContent('<div id="groceryinfo"><strong>' + groceryInfoObject.name[i] + '</strong><br>' +
		groceryInfoObject.address[i] + '<br>' + '<a href=' +  groceryInfoObject.url[i] + ' target="_blank">' + "Click to burn off this meal from your location" + "</a>" + '<br></div>')

		infowindow.open(map, marker);
	
		var origin1 = positionArray[i];
		var destinationA = groceryInfoObject.address[i];
		console.log(destinationA);
		var service = new google.maps.DistanceMatrixService;
		service.getDistanceMatrix({
		origins: [origin1],
		destinations: [destinationA],
		travelMode: 'WALKING',
		unitSystem: google.maps.UnitSystem.IMPERIAL,
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
				outputDiv.innerHTML += outputDiv.innerHTML += `Take a nice brisk walk to ` + `<strong>` + chosenGroceryName + `</strong>` +  ` to pick up any remaining ingredients ANNNND burn off some calories! It'll only take you ` + results[j].distance.text + `, or ` + results[j].duration.text + `, to get there from ZIP code ` + zipCode + `. GET MOVIN'!`;
			}}}});

	
	}
	}
	)(marker, i));
		
	}
	}


