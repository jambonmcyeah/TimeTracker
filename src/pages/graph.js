/// <reference path="../../references/chrome.d.ts" />
/// <reference path="../../references/jquery.d.ts" />
var config;
chrome.storage.sync.get('config', function(items) {
    config = items['config'];
    if (config.instantsearch.value) {
        document.getElementById('search').onpaste = search;
        document.getElementById('search').oninput = search;
    }
    document.getElementById('search').onkeypress = search;
})

function search(e) {
    if (config.instantsearch.value) {
        setTimeout(function(e) {
            if (e.which || e.keyCode) {
                if (!(e.which === 8 || e.keyCode === 8 || e.which === 46 || e.keyCode === 46)) {
                    return false;
                }
            }
            graphWebsites(true, 200, document.getElementById('search').value);
            if (!document.getElementById('x')) {
                var val = document.getElementById('search').value;
                document.getElementById('searchdiv').innerHTML += '<span id="x" title="Clear Search"></span>';
                document.getElementById('search').onkeypress = search;
                document.getElementById('search').onpaste = search;
                document.getElementById('search').oninput = search;
                document.getElementById('search').value = val;
                document.getElementById('search').focus();
                document.getElementById('x').onclick = clearsearch;
            }
            if (!document.getElementById('search').value) {
                document.getElementById('x').remove();
            }
        }, 50, e);
    } else {
        if (e.which == 13 || e.keyCode == 13) {
            graphWebsites(true, 200, document.getElementById('search').value);
            if (!document.getElementById('x')) {
                var val = document.getElementById('search').value;
                document.getElementById('searchdiv').innerHTML += '<span id="x" title="Clear Search"></span>';
                document.getElementById('search').onkeypress = search;
                document.getElementById('search').value = val;
                document.getElementById('search').focus();
                document.getElementById('x').onclick = clearsearch;
            }
            if (!document.getElementById('search').value) {
                document.getElementById('x').remove();
            }
            return false;
        }
    }
    return true;

}

function clearsearch() {
    document.getElementById('search').value = '';
    graphWebsites(true, 200, '');
    document.getElementById('search').onkeydown = search;
    return false;
}

function getTimeString(time) {
    var text = '';
    var days = Math.floor(time / 86400);
    var hours = Math.floor((time % 86400) / 3600);
    var minutes = Math.floor(((time % 86400) % 3600) / 60);
    var seconds = ((time % 86400) % 3600) % 60;
    if (days > 0) {
        text = days.toString() + ' day';
        if (days > 1) {
            text += 's';
        }
        text += ', ';
    }
    if (hours > 0) {
        text += hours.toString() + ' hour';
        if (hours > 1) {
            text += 's';
        }
        text += ', ';
    }
    if (minutes > 0) {
        text += minutes.toString() + ' minute';
        if (minutes > 1) {
            text += 's';
        }
        text += ', ';
    }
    if (seconds > 0) {
        text += seconds.toString() + ' second';
        if (seconds > 1) {
            text += 's';
        }
        text += ', ';
    }
    text = text.substring(0, text.length - 2);
    return text;
}

function getTextSize(text) {
    var test = document.getElementById("SizeTest");
    test.innerText = text;
    return { 'height': (test.clientHeight + 125), 'width': (test.clientWidth + 125) };
}

function graphWebsites(isanimated, animatetime, searchvalue) {
    var chart = document.getElementById('chart1');
    chart.innerHTML = '';
    chart.innerHTML = '<div class="container"></div>';
    if (isanimated) {
        var animationscript = '';
    }

    chrome.storage.sync.get('websitetimes', function(items) {
        if (!items['websitetimes']) {
            $('#cover0').remove();
            document.getElementById('chart1').innerText = 'No Data Found...'
        }
        var keysSorted = Object.keys(items['websitetimes']).sort(function(a, b) { return items['websitetimes'][b] - items['websitetimes'][a]; });
        var max = items['websitetimes'][keysSorted[0]];
        for (var i = 0; i < keysSorted.length; i++) {
            if (searchvalue) {
                if (keysSorted[i].indexOf(searchvalue) === -1) {
                    continue;
                }
            }
            var barwidth = items['websitetimes'][keysSorted[i]] / max;
            var element = '<div class="container"><div class="label">';
            if (isanimated) {
                element += keysSorted[i] + '</div>';
                element += '<div class="barcontainer"><div id="bar' + i.toString() + '" ' + 'class="bar">';
            } else {
                element += keysSorted[i] + '</div>';
                element += '<div class="barcontainer"><div class="bar" style="width:';
                element += (barwidth * 100).toString() + '%;' + '">';
            }
            var timestr = getTimeString(items['websitetimes'][keysSorted[i]]);
            if (getTextSize(timestr).width > (chart.clientWidth * 0.94 * barwidth)) {
                element += '</div>';
                element += '<div class="percentage" style="float:left;color:#000000;text-align:left;margin-left:12px;">' + timestr + '</div>';
            } else {
                element += '<div class="percentage">' + timestr + '</div>';
                element += '</div></div>';
            }
            element += '</div></div>';
            chart.innerHTML += element;
            if (isanimated) {
                animationscript += '$(' + "'#bar" + i.toString() + "'" + ')' + ".animate({" + "'width'" + ':' + "'" + (barwidth * 100).toString() + "%'" + '},' + "{'duration':" + animatetime.toString() + ", 'queue': false});";
            }

        }
        if (isanimated) {
            $('#cover0').animate({ 'opacity': '0' }, 1000, function() {
                this.remove();
                $('#loadingstyle').remove();
            });
            eval(animationscript);
        } else {
            document.getElementById('cover0').remove();
            document.getElementById("loadingstyle").remove();
        }
    });
}
graphWebsites(true, 1500);