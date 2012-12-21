/*global chrome:true, console:true, document:true, window:true, setTimeout:true*/
(function () {
    'use strict';

    var omnibox = chrome.omnibox,
        yui = document.getElementById('yui'),
        query;

    omnibox.onInputChanged.addListener(function (query, callback) {
        var handler = function (e) {
            var data = e.data;

            if (data.name === 'gossipResponse' && data.query === query) {
//                console.dir(data.results);

                omnibox.setDefaultSuggestion({
                    description: data.results.shift().description
                });

                callback(data.results);
            }
        };
        window.addEventListener('message', handler);

        // clean up potential leaks
        setTimeout(function () {
            window.removeEventListener('message', handler);
        }, 5000);

        yui.contentWindow.postMessage({
            name: 'gossipRequest',
            query: query
        }, '*');
    });

}());
