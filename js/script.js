function loadData() {

	var $body = $('body');
	var $wikiElem = $('#wikipedia-links');
	var $nytHeaderElem = $('#nytimes-header');
	var $nytElem = $('#nytimes-articles');
	var $greeting = $('#greeting');


	var $weatherHeaderElem = $('#weather-header');
	var $weatherDiv = $('#weather');


	// clear out old data before new request
	$wikiElem.text("");
	$nytElem.text("");

	var streetStr = $('#street').val();
	var cityStr = $('#city').val();
	var address = streetStr + ', ' + cityStr;

	$greeting.text('So, you want to live at ' + address + '?');


	// load streetview
	var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
	$body.append('<img class="bgimg" src="' + streetviewUrl + '">');

	// weather

	// NY Times Articles
	var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=15188a0c2e7a489eb9f1af00c9d6268f'


	$.getJSON(nytimesUrl, function (data) {
			$nytHeaderElem.text('New York Times Articles About ' + cityStr);

			articles = data.response.docs;
			for (var i = 0; i < articles.length; i++) {
				var article = articles[i];
				$nytElem.append('<li class = "article">' +
					'<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
					'<p>' + article.snippet + '</p>' +
					'</li>');
			};

		})
		.error(function (e) {
			$nytHeaderElem.text('New York Times Articles About ' + cityStr + 'Could Not Be Loaded');
		});


	$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + cityStr + '&mode=json&units=imperial&APPID=a65f04b4e8bf4d1784e54d5d8d02f693', function (json) {
		$weatherHeaderElem.text('Weather in ' + cityStr);
		//		document.write(JSON.stringify(json));
		console.log(json);
		$('#cityName').text(json['name']);
		$('#ambientWeather').text(json['weather'][0]['description']);
		var iconCode = json['weather'][0]["icon"]
		var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
		console.log(iconUrl);
		$('#iconDay').attr("src", iconUrl);
		$('#temp').text(json["main"]["temp"]);
	});


	// weather
	//	var owUrl = 'http://openweathermap.org/data/2.5/forecast?q=' + cityStr + '&appid=a65f04b4e8bf4d1784e54d5d8d02f693';
	//	var owUrl = 'openweathermap.org/data/2.5/forecast?q=London,us&mode=xml' + '&appid=a65f04b4e8bf4d1784e54d5d8d02f693';
	//
	//
	//
	//	$.getJSON(owUrl, function (data) {
	//			$weatherHeaderElem.text('Weather in ' + cityStr);
	//
	//
	//			
	//			$('#weather-detail-main').html(data.weather[0].main);
	//			$('#weather-detail-small').html(data.weather[0].description.replace(/\w\S*/g, function (c) {
	//				return c.charAt(0).toUpperCase() + c.substr(1).toLowerCase();
	//			}));
	//			setIcon(data.weather[0].icon);
	//			$('#weather-icon').attr('src', "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
	//			temp = data.main.temp;
	//			setTempAsC();
	//
	//		})
	//		.error(function (e) {
	//			$weatherHeaderElem.text('Weather in ' + cityStr + 'Could Not Be Loaded');
	//		});







	// Wikipedia AJAX request

	// load wikipedia data
	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
	var wikiRequestTimeout = setTimeout(function () {
		$wikiElem.text("failed to get wikipedia resources");
	}, 8000);

	$.ajax({
		url: wikiUrl,
		dataType: "jsonp",
		jsonp: "callback",
		success: function (response) {
			var articleList = response[1];

			for (var i = 0; i < articleList.length; i++) {
				articleStr = articleList[i];
				var url = 'http://en.wikipedia.org/wiki/' + articleStr;
				$wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
			};

			clearTimeout(wikiRequestTimeout);
		}
	});





	return false;
};

$('#form-container').submit(loadData);