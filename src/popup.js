/// <reference path="../references/chrome.d.ts" />
/// <reference path="../references/jquery.d.ts" />

var initialized=false
var current = false;
var totaltime;

function autosize() {
    $('.autosize').each(function(i, box) {

        var width = $(box).width(),
            html = '<span style="white-space:nowrap">',
            line = $(box).wrapInner(html).children()[0],
            n = 100;

        $(box).css('font-size', n);

        while ($(line).width() > width) {
            $(box).css('font-size', --n);
        }

        $(box).text($(line).text());

    });
}
autosize();

document.getElementById('settingsbtn').onclick = function() {
    chrome.tabs.create({ 'url': 'pages/settings.html' })
};

function setTime(targetelement, time) {
    targetelement.innerText = "";
    var days = Math.floor(time / 86400);
    var hours = Math.floor((time % 86400) / 3600);
    var minutes = Math.floor(((time % 86400) % 3600) / 60);
    var seconds = ((time % 86400) % 3600) % 60;
    if (days > 0) {
        targetelement.innerText = days.toString() + ' day';
        if (days > 1) {
            targetelement.innerText += 's';
        }
        targetelement.innerText += ', ';
    }
    if (hours > 0) {
        targetelement.innerText += hours.toString() + ' hour';
        if (hours > 1) {
            targetelement.innerText += 's';
        }
        targetelement.innerText += ', ';
    }
    if (minutes > 0) {
        targetelement.innerText += minutes.toString() + ' minute';
        if (minutes > 1) {
            targetelement.innerText += 's';
        }
        targetelement.innerText += ', ';
    }
    targetelement.innerText += seconds.toString() + ' second';
    if (seconds > 1 || seconds === 0) {
        targetelement.innerText += 's';
    }
}

function startLoop(targetelement) {
    return setInterval(function() {
        totaltime += 1;
        setTime(targetelement, totaltime);
        autosize();
    }, 1000);
}

function initialize() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getTime" }, function(timetracker) {
            if (!timetracker) {
                setTimeout(initialize, 1);
                return undefined;
            }
            document.getElementById('div1').innerText = timetracker[0];
            if (current) {
                document.getElementById('currentbtn').style.backgroundColor = '#cccccc';
                totaltime = timetracker[1];
                setTime(document.getElementById('div2'), totaltime);
                autosize();
                startLoop(document.getElementById('div2'));
                document.getElementById('div0').innerText = 'Your current time on';
            } else {
                document.getElementById('totalbtn').style.backgroundColor = '#cccccc';
                chrome.storage.sync.get('websitetimes', function(items) {
                    if (!items['websitetimes']) {
                        items['websitetimes'] = new Object();
                    }
                    if (!items['websitetimes'][timetracker[0]]) {
                        items['websitetimes'][timetracker[0]] = 0;
                    }
                    totaltime = items['websitetimes'][timetracker[0]] + timetracker[1];
                    setTime(document.getElementById('div2'), totaltime);
                    autosize();
                    startLoop(document.getElementById('div2'));
                    document.getElementById('div0').innerText = 'Your total time on';
                });
            }
            initialized = true;
        });
    });
}

initialize();

document.getElementById('totalbtn').onclick = function() {
    if(initialized)
    {
        current = false;
        document.getElementById('div0').innerText = 'Your total time on';
        document.getElementById('totalbtn').style.backgroundColor = '#cccccc';

        document.getElementById('currentbtn').style.backgroundColor = '#FFFFFF';
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "getTime" }, function(timetracker) {
                document.getElementById('div1').innerText = timetracker[0];
                chrome.storage.sync.get('websitetimes', function(items) {
                        if (!items['websitetimes']) {
                            items['websitetimes'] = new Object();
                        }
                        if (!items['websitetimes'][timetracker[0]]) {
                            items['websitetimes'][timetracker[0]] = 0;
                        }
                        totaltime = items['websitetimes'][timetracker[0]] + timetracker[1];
                        setTime(document.getElementById('div2'), totaltime);
                        autosize();
                });
            });
        });
    }
};

document.getElementById('currentbtn').onclick = function() {
    if(initialized)
    {
        current = true;
        document.getElementById('div0').innerText = 'Your current time on';
        document.getElementById('currentbtn').style.backgroundColor = '#cccccc';

        document.getElementById('totalbtn').style.backgroundColor = '#FFFFFF';
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "getTime" }, function(timetracker) {
                document.getElementById('div1').innerText = timetracker[0];
                totaltime = timetracker[1];
                setTime(document.getElementById('div2'), totaltime);
                autosize();
            });
        });
    }
};