// common configuration
require.config({
    'baseUrl': '/js',
    'paths': {
        'jquery': 'vendor/jquery/dist/jquery.min',
        'ramda': 'ramda',
        'pointfree': 'vendor/pointfree/dist/pointfree.amd',
        'pixi': 'vendor/pixi/bin/pixi',
        'future': 'data.future.umd',
        'bacon': 'vendor/bacon/dist/Bacon.min',
        'socketio': 'io' },
    'shim': {
        'jquery': { exports: '$' },
        'socketio': { exports: 'io' },
        'lodash': { exports: '_' },
        'ramda': { exports: 'ramda' },
        'bootstrap': { deps: ['jquery'] },
        'jquery.easing.min': { deps: ['jquery'] }
    }
});