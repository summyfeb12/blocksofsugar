


var currentZIP;
function scanLocation (callback) {
	getCityForZip(currentZIP,function (cityname) {
		callForLocation(cityname,currentZIP,function (data) {
			

			callback(data)


		});
	});
}




function Location (argument) {
	// body...
}

// path =  content/philly/zipcodes
function getAPIURL (path) {
	return 'https://api.everyblock.com/'+path+'/.json?token=818111003c3b49716d369cf290958441685e34c9';
}

function callForLocation (cityName,zip,callback) {
	var url = getAPIURL('content/'+cityName.toLowerCase()+'/locations/'+zip+'/timeline');

	jsonp_request(url,function (data) {
		callback(data);
	});

}

function getCityForZip (zip, callback) {
	var isDone = false;
	jsonp_request(getAPIURL('content'),function (data) {
		for (var i = 0; i < data.length; i++) {
			if (isDone) return;
			var cityname = data[i].short_name;
			jsonp_request(getAPIURL('content/'+cityname+'/zipcodes'),
				(function (cn) {
					return function (zipdata) {
						console.log(zipdata);
						for (var j = 0; j < zipdata.length; j++) {
							if (zipdata[j].name == zip) {
								// console.log("approved");
								callback(cn);
								isDone = true;
								return;
							}
						};
					}
				})(cityname)
			);
		};
	});
}



