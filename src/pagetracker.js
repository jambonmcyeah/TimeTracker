/// <reference path="../references/chrome.d.ts" />
var config;

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
if (window.location.pathname != '/_/chrome/newtab') {
    chrome.storage.sync.get('config', function(items) {
        config = items['config']
        var timetracker = new Array();
        if (!config.fullname.value) {
            timetracker[0] = location.hostname;
            var isIP = 1;
            var sections = timetracker[0].split('.');
            for (var i = 0; i < sections.length; i++) {
                isIP = isIP & !isNaN(sections[i]);
            }
            if (!isIP) {
                if ((timetracker[0].match(/\./g) || []).length > 1) {
                    timetracker[0] = timetracker[0].substring(timetracker[0].indexOf('.') + 1);
                }
            }
        } else {
            timetracker[0] = location.hostname;
        }
        timetracker[1] = 0;

        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            switch (message.type) {
                case "getTime":
                    sendResponse(clone(timetracker));
                    break;
                default:
                    console.warn("Unrecognised message: ", message);
            }
        });

        setInterval(
            function() {
                if (!document["hidden"]) {
                    timetracker[1] += 1;
                }
            },
            1000);
        window.onunload = function() {
            chrome.runtime.sendMessage({ 'type': 'setTime', 'content': timetracker });
        };
    })
}