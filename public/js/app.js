/* global define */
define(['jquery', 'ramda', 'pointfree', 'maybe', 'player', 'socketio', 'bacon', 'http'], function($, _, P, Maybe, Player, io, bacon, http) {
    'use strict';
    io.extendFn();

    // HELPERS ////////////////////////////////////////////////////
    var compose = P.compose;

    var map = P.map;

    var id = function(x) {
        return x;
    };

    var log = function(x) {
        console.log(x);
        return x;
    };

    var fork = _.curry(function(f, future) {
        return future.fork(log, f);
    });

    var setHtml = _.curry(function(sel, x) {
        return $(sel).html(x);
    });

    var listen = _.curry(function(event, target) {
        return bacon.fromEventTarget(target, event);
    });

    var getData = _.curry(function(name, elt) {
        return $(elt).data(name);
    });

    // PURE ///////////////////////////////////////////////////////

    //+ eventValue :: DomEvent -> String
    var eventValue = compose(_.get('value'), _.get('target'));

    //+ valueStream :: DomEvent -> EventStream String
    var valueStream = compose(map(eventValue), listen('keyup'));

    //+ termToUrl :: String -> URL
    var termToUrl = function(term) {
        return 'http://localhost:9200/recipesindex/_search?q=_all:' + term;
    };

    //+ urlStream :: DomEvent -> EventStream String
    var urlStream = compose(map(termToUrl), valueStream);

    //+ getInputStream :: Selector -> IO EventStream String
    var getInputStream = compose(map(urlStream), $.toIO());

    //+ render :: Entry -> Dom
    var render = function(e) {
        return $('<li/>', { text: e._source.name, 'data-object': JSON.stringify(e._source) });
    };

    //+ renderDetail :: Entry -> Dom
    var renderDetail  = function(e) {

        var detail  = '<li> Name: '  + e.name + '<li/>';
            detail += '<li> Cook Time: ' + e.cookTime + '<li/>';
            detail += '<li> Prepartion Time: ' + e.prepTime + '<li/>';
            detail += '<li> Description: ' + e.description + '<li/>';
            detail += '<img src=' + e.image + '/>';
            detail += '<li> Ingredients : ' + e.ingredients + '<li/>';
            detail += '<li> Source : ' + e.source + '<li/>';

        return detail;
    };

    //+ hitEntries :: Response -> [Dom]
    var hitEntries = compose(map(render), _.get('hits'), _.get('hits'));

    //+ search :: URL -> Future [Dom]
    var search = compose(map(hitEntries), http.getJSON);

    //+ clickStream :: DomElement -> EventStream DomElement
    var clickStream = compose(map(_.get('target')), listen('click'));

    //+ dataObject :: DomElement -> Maybe Object
    var dataObject = compose(Maybe, getData('object'));

    // IMPURE /////////////////////////////////////////////////////
    getInputStream('#search').runIO().onValue(
        compose(fork(setHtml('#results')), search)
    );

    clickStream(document.body).onValue(
        compose(map(setHtml('#detail')), map(renderDetail), dataObject)
    );
});