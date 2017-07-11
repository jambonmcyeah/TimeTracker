/// <reference path="../../references/chrome.d.ts" />
/// <reference path="../../references/jquery.d.ts" />
var config;
var separator = '<div class="separator"></div>';

function cleartime() {
    if (confirm('You sure you want to clear your time history?')) {
        chrome.storage.sync.remove('websitetimes')
    }
}

function clearsettings() {
    if (confirm('You sure you want to reset your settings')) {
        chrome.storage.sync.remove('config');
        location.reload();
    }
}

function saveconfig() {
    var tmp = document.getElementsByClassName('settinginput');
    for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].type == 'checkbox') {
            var tmpsave = config[tmp[i].id].save
            config[tmp[i].id].value = eval(config[tmp[i].id].save.replace(new RegExp('<val>', 'g'), tmp[i].checked.toString()).replace(new RegExp('<initval>', 'g'), config[tmp[i].id].value.toString()));
            config[tmp[i].id].save = tmpsave;
            tmp[i].checked = config[tmp[i].id].value;
        } else if (tmp[i].type == 'textbox') {
            var tmpsave = config[tmp[i].id].save
            config[tmp[i].id].value = eval(config[tmp[i].id].save.replace(new RegExp('<val>', 'g'), tmp[i].checked).replace(new RegExp('<initval>', 'g'), config[tmp[i].id].value));
            config[tmp[i].id].save = tmpsave;
            tmp[i].value = config[tmp[i].id].value;
        }
    }
    chrome.storage.sync.set({ 'config': config });
}

document.getElementById('retimebtn').onclick = cleartime;
document.getElementById('resetbtn').onclick = clearsettings;
document.getElementById('savebtn').onclick = saveconfig;

function loadPage() {
    var sel = document.getElementById('settings');
    var sortedkeys = Object.keys(config).sort();

    for (var i = 0; i < sortedkeys.length; i++) {
        sel.innerHTML += separator;
        sel.innerHTML += '<div class="settingname" title="' + config[sortedkeys[i]].description + '">' + config[sortedkeys[i]].name + '</div>';
        var temp = '<input class="settinginput" id="' + sortedkeys[i] + '" title="' + config[sortedkeys[i]].description + '" ';
        switch (config[sortedkeys[i]].type) {
            case 'bool':
                temp += 'type="checkbox" ' + (config[sortedkeys[i]].value ? 'checked="checked"' : '') + ' />';
                break;
            case 'string':
                temp += 'type="textbox" />'
            case 'number':
                temp += 'type="textbox" />'
                break;
            default:
                break;
        }
        sel.innerHTML += temp;
    }
    document.getElementsByClassName('separator')[0].remove();
}

chrome.storage.sync.get('config', function(items) {
    config = items['config']
    if (!config) {
        chrome.runtime.sendMessage({ 'type': 'getVar', 'content': 'defaultConfig' }, function(response) {
            config = response;
            loadPage();
        });
    } else {
        loadPage();
    }

});