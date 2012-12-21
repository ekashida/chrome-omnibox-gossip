/*global YUI:true,chrome:true,console:true,XMLHttpRequest:true*/
YUI({
    filter: 'raw'
}).use('event-custom', 'gossip-model', function (Y) {
    'use strict';

    var gossipModel = new Y.GossipModel();

    // TODO: Why are YUI and Y not an EventTarget?
    Y.augment(Y, Y.EventTarget);

    Y.config.win.addEventListener('message', function (e) {
        Y.fire(e.data.name, e); // route internally
    });

    Y.on({
        gossipRequest: function (e) {
            var query = e.data.query;

            gossipModel.set('query', query);
            gossipModel.load(function (err) {
                var results = [],
                    suggestions,
                    json,
                    len,
                    i;

                if (err) {
                    Y.log('Failed to load gossip results: ' + err.message, 'error');
                    return;
                }

                json = gossipModel.toJSON();
                suggestions = json.suggestions;
                len = suggestions.length;

                for (i = 0; i < len; i += 1) {
                    results[i] = {
                        description: suggestions[i].k,
                        content: suggestions[i].k
                    };
                }

                e.source.postMessage({
                    name: 'gossipResponse',
                    query: json.query,
                    results: results
                }, '*');

                gossipModel.save();
            });
        }
    });
});

