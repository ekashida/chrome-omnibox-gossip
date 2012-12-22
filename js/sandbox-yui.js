/*global YUI:true,chrome:true,console:true,XMLHttpRequest:true*/
YUI({
    filter: 'raw'
}).use('event-custom', 'gossip-model', 'escape', function (Y) {
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
                    text,
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
                    text = suggestions[i].k;
                    results[i] = {
                        description: Y.Escape.html(text),
                        content: text
                    };
                }

                e.source.postMessage({
                    name: 'gossipResponse',
                    query: json.query,
                    results: results
                }, e.origin);

                gossipModel.save();
            });
        }
    });
});

