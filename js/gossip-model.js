/*global YUI:true, XMLHttpRequest:true*/
/*jslint nomen:true*/
YUI.add('gossip-model', function (Y, NAME) {
    'use strict';

    Y.GossipModel = Y.Base.create('gossipModel', Y.Model, [], {

        initializer: function (config) {
            config = config || {};

            this.gossipUrl = config.gossipUrl || 'http://sugg.us.search.yahoo.net/gossip-us-ura';
            this.numResults = config.numResults || '8';
        },

        sync: function (action, options, callback) {
            switch (action) {
            case 'create':
                return;
            case 'read':
                this._fetchGossip(callback);
                return;
            case 'update':
                return;
            case 'delete':
                return;
            default:
                callback(new Error('Invaid action'));
            }
        },

        parse: function (res) {
            var suggestions = res.getElementsByTagName('s'),
                results = [],
                parsed,
                len,
                i,
                s;

            for (i = 0, len = suggestions.length; i < len; i += 1) {
                s = suggestions[i];
                results[i] = {
                    k:  s.getAttribute('k'),
                    m:  s.getAttribute('m'),
                    d:  s.getAttribute('d'),
                    rt: s.getAttribute('rt'),
                    rp: s.getAttribute('rp'),
                    fd: s.getAttribute('fd')
                };
            }

            return {
                query: res.getElementsByTagName('m')[0].getAttribute('q'),
                suggestions: results
            };
        },

        _fetchGossip: function (callback) {
            var url,
                req;

            url = this.gossipUrl + '?' + Y.QueryString.stringify({
                droprotated: 1,
                bm: 3,
                nresults: this.numResults,
                command: this.get('query')
            });

            Y.log('Gossip request url: ' + url, 'debug', NAME);

            req = new XMLHttpRequest();
            req.open('GET', url, true);

            req.onload = Y.bind(function () {
                callback(null, req.responseXML);
            }, this);

            req.send(null);
        }

    }, {
        ATTRS: {
            query: {
                value: ''
            },
            suggestions: {
                value: []
            }
        }
    });

}, '0.0.1', { requires: [
    'model',
    'querystring-stringify'
]});
