// common configuration
require.config({
    'baseUrl': '/js',
    'paths': {
        'jquery': 'vendor/jquery/dist/jquery.min',
        'angular': 'vendor/angular/angular.min',
        'angular-route': 'vendor/angular-route/angular-route.min',
        'ramda': 'ramda',
        'pointfree': 'vendor/pointfree/dist/pointfree.amd',
        'pixi': 'vendor/pixi/bin/pixi',
        'future': 'data.future.umd',
        'bacon': 'vendor/bacon/dist/Bacon.min',
        'socketio': 'io' },
    'shim': {
        'jquery': { exports: '$' },
        'angular': { exports: 'angular', deps: ['jquery'] },
        'angular-route': { deps: ['angular'] },
        'socketio': { exports: 'io' },
        'lodash': { exports: '_' },
        'ramda': { exports: 'ramda' },
        'bootstrap': { deps: ['jquery'] },
        'jquery.easing.min': { deps: ['jquery'] }
    }
});