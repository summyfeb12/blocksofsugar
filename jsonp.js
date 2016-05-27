
// avoid XHR's XSS blocking

var jsonp_callbacks = [];
function jsonp_request(url,callback,use_ts,return_string,add_random_token){
	use_ts = true;
	var callbackID,scriptElement,usedIDs=[];
	if (jsonp_callbacks.length > 0){
		for (var i = 0; i < jsonp_callbacks.length; i++) {
			if (isObject(jsonp_callbacks[i]))
				usedIDs.push(jsonp_callbacks[i].id);
		}
		var currentID = 0;
		for (var a = 0; usedIDs.indexOf(a) > -1;a++) {
			currentID = a;
		}
		callbackID = currentID+1;
	} else {
		callbackID = 0;
	}
	var urlArgs = {};
	ASSET_PATH = 'http://assets.topperstudios.com/'
	if (use_ts){
		url = ASSET_PATH+'php/json.php?url='+encodeURIComponent(url);
	}
	if (callback){
		urlArgs["callback"] = "window.jsonp_receive("+callbackID+")";
	}
	if (return_string){
		urlArgs["str"] = "yes";
	}
	if (add_random_token){
		urlArgs["__random"] = Math.random();
	}
	scriptElement = document.createElement("script");
	
	jsonp_callbacks.push({
		element:scriptElement,
		callback:callback,
		id:callbackID
	});

	scriptElement.src = addParamsToURL(url,urlArgs);
	scriptElement.async = true;
	document.getElementsByTagName('head')[0].appendChild(scriptElement);
	
}

window.jsonp_receive = function (id){
	var index = 0;
	for (var i = 0; i < jsonp_callbacks.length; i++) {
		if (isObject(jsonp_callbacks[i])){
			if (jsonp_callbacks[i].id==id){
				index = i;
			}
		}
	}
	var callback = jsonp_callbacks[index].callback;
	jsonp_callbacks[index].element.parentNode.removeChild(jsonp_callbacks[index].element);
	delete jsonp_callbacks[index];
	return callback;
}




function isObject(data){
	return (typeof(data)=="object");
}
function addParamsToURL(url,paramsObj) {
	if (url.indexOf("?") != -1){
		url = url+'&';
	} else {
		url = url+'?';
	}
	return url+urlobj(paramsObj);
}
function urlobj(object) {
	var strBuilder = [];
	for (var key in object) if (object.hasOwnProperty(key)) {
	   strBuilder.push(encodeURIComponent(key)+'='+encodeURIComponent(object[key]));
	}
	return strBuilder.join('&');
}