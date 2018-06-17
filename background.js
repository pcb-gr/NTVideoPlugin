
ws = new WebSocket('ws://localhost:82');
initWebsocket();
function initWebsocket() {
	ws.onopen = function(e) {
		console.log("Connection opened");
		
	}
	
	ws.onmessage = function (e) {
        console.log(e.data);
        openNewTab(e.data.replace(/"/g, ""))
      
    }
}


function openNewTab(url) {
	chrome.tabs.create({
		url : url
	});
}
chrome.webRequest.onBeforeSendHeaders.addListener(function(trafficInfo) {
	if (trafficInfo.url.indexOf("https://video.xx.fbcdn.net") != -1) {
		  ws.send(trafficInfo.url);
		chrome.tabs.remove(trafficInfo.tabId);
	}
}, {
	urls : [ "<all_urls>" ]
}, [ 'requestHeaders', 'blocking' ]);