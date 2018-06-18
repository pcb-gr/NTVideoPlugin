
ws = new WebSocket('ws://localhost:90');
initWebsocket();
var tabsGetLink = {};
function initWebsocket() {
	ws.onopen = function(e) {
		console.log("Connection opened");
		
	}
	
	ws.onmessage = function (e) {
        console.log(e.data);
        openNewTab(e.data.replace(/"/g, ""), function(tab) {
			tabsGetLink[tab.id] = tab.url
		})
      
    }
}


function openNewTab(url, callback) {
	chrome.tabs.create({
		url : url
	}, function(tab) {
		callback(tab)
	});
}

chrome.webRequest.onBeforeRequest.addListener(function(request){
	
	if (request.url.indexOf('.css') != -1 
		||request.url.indexOf('.jpg') != -1 
		||request.url.indexOf('.gif') != -1 
		|| request.url.indexOf('google') != -1
		|| request.url.indexOf('font') != -1
		|| request.url.indexOf('facebook') != -1
		|| request.url.indexOf('wp-') != -1
		|| request.url.indexOf('mgid') != -1
	) {
		console.log('Blocked: ' + request.url);
		return { cancel: true };
	}
}, { urls: [ "<all_urls>" ]}, ['blocking'])

chrome.webRequest.onBeforeSendHeaders.addListener(function(trafficInfo) {
	console.log(trafficInfo.url);
	if (trafficInfo.url.indexOf("https://video.xx.fbcdn.net") != -1 || trafficInfo.url.indexOf("ok.ru/videoembed") != -1) {
		ws.send( JSON.stringify({movieHref: tabsGetLink[trafficInfo.tabId], directLink: trafficInfo.url} ));
		delete tabsGetLink[trafficInfo.tabId];
		chrome.tabs.remove(trafficInfo.tabId);
		
	}
}, {
	urls : [ "<all_urls>" ]
}, [ 'requestHeaders', 'blocking' ]);