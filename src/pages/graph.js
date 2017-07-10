/// <reference path="../../references/chrome.d.ts" />
/// <reference path="../../references/jquery.d.ts" />

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
    return { 'height': (test.clientHeight + 150), 'width': (test.clientWidth + 150) };
}

function graphWebsites(isanimated, animatetime) {
    var chart = document.getElementById('chart1');
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