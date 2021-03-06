﻿/// <reference path="../references/chrome.d.ts" />

var config = {
    'fullname': {
        'name': 'Use Full Address',
        'description': 'When enabled full website address is used (e.g. mail.google.com instead of google.com)',
        'type': 'bool',
        'value': false,
        'save': "if (<val> != <initval>) {\
                    if(confirm('You sure you want to save? This will remove your time history!'))\
                    {\
                        chrome.storage.sync.remove('websitetimes');\
                        <val>;\
                    }\
                    else{\
                        !<val>;\
                    }\
                } else {\
                    <val>;\
                }"
    },
    'instantsearch': {
        'name': 'Enable Instant Search',
        'description': 'Enable instant search in the graph page',
        'type': 'bool',
        'value': false,
        'save': "<val>;"
    },
    'animated': {
        'name': 'Enable Animations',
        'description': 'Enable Animations',
        'type': 'bool',
        'value': true,
        'save': "<val>;"
    }
};
chrome.storage.sync.get('config', function(items) {
    if (!items['config']) {
        items['config'] = config;
        chrome.storage.sync.set(items);
    }
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch (message.type) {
        case 'setTime':
            chrome.storage.sync.get('websitetimes', function(items) {
                if (!items['websitetimes']) {
                    items['websitetimes'] = new Object();
                }
                if (items['websitetimes'][message.content[0]] == undefined) {
                    items['websitetimes'][message.content[0]] = 0;
                }
                items['websitetimes'][message.content[0]] += message.content[1];
                chrome.storage.sync.set(items);
            });
            break;
        case 'getVar':
            switch (message.content) {
                case 'defaultConfig':
                    sendResponse(config);
                    break;
                default:
                    console.warn('Unknown var')
            }
            break;
        default:
            console.warn("Unrecognised message: ", message);
    }
});