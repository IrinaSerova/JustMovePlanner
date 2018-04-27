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

	$greeting.text('So, you want to live in ' + cityStr + '?');


	// load streetview
	var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=640x640&location=' + address + '';
	$body.append('<img class="bgimg" src="' + streetviewUrl + '">');

	// weather

	// NY Times Articles
	var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=15188a0c2e7a489eb9f1af00c9d6268f'


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


	$.getJSON('https://api.openweathermap.org/data/2.5/weather?q=' + cityStr + '&mode=json&units=imperial&APPID=a65f04b4e8bf4d1784e54d5d8d02f693', function (data) {
		$weatherHeaderElem.text('Weather in ' + cityStr);
		//		document.write(JSON.stringify(json));
		console.log(data);
		$('#cityName').text(data['name']);
		$('#ambientWeather').text(data['weather'][0]['description']);
		var iconCode = data['weather'][0]["icon"]
		var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
		console.log(iconUrl);
		$('#iconDay').attr("src", iconUrl);
		$('#temp').text(data["main"]["temp"]);

	});
	$('#degree').click(function () {
		var text = $(this).text();
		if (text == '°F') {
			var f = parseInt($('#temp').text());

			$('#temp').text(Math.round((f - 32) * (5 / 9)));
			$(this).text('°C');
		} else {
			var c = parseInt($('#temp').text());
			$('#temp').text(Math.round(c * (9 / 5) + 32));
			$(this).text('°F');
		}
	});


	// Wikipedia AJAX request

	// load wikipedia data
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
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
				var url = 'https://en.wikipedia.org/wiki/' + articleStr;
				$wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
			};

			clearTimeout(wikiRequestTimeout);
		}
	});
	return false;
};

$('#form-container').submit(loadData);