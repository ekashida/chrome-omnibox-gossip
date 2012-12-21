/*global chrome:true, console:true, document:true, window:true, setTimeout:true*/
(function () {
    'use strict';

    var omnibox = chrome.omnibox,
        yui = document.getElementById('yui'),
        handleGossipResponse,
        currentQuery,
        suggest;

    window.addEventListener('message', function (e) {
        var data = e.data || {},
            name = data.name || '';

        if (!name) {
            return;
        }

        switch (name) {
        case 'gossipResponse':
            handleGossipResponse(data);
            return;
        default:
            console.warn('Ignoring window message: ' + data.name);
        }
    });

    omnibox.onInputChanged.addListener(function (query, callback) {
        currentQuery = query;
        suggest = callback;

        yui.contentWindow.postMessage({
            name: 'gossipRequest',
            query: query
        }, '*');
    });

    handleGossipResponse = function (data) {
        if (data.query === currentQuery) {
            // selected suggestion should not have content
            omnibox.setDefaultSuggestion({
                description: data.results.shift().description
            });

            // tell omnibox what suggestions to render
            suggest(data.results);
        }
    };
}());
