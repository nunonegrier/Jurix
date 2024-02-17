require.config({

    // alias libraries paths
    paths: {
        jquery: 'vendor/jquery/dist/jquery',
        'jqueryUI': 'vendor/jquery-ui/jquery-ui',
        'jqueryUIDatepickerPtBR': 'vendor/jquery-ui/ui/i18n/datepicker-pt-BR',
        'version': 'vendor/jquery-ui/ui/version',
        'keycode': 'vendor/jquery-ui/ui/keycode',
        'domReady': 'vendor/requirejs-domready/domReady',
        'bootstrap': 'vendor/bootstrap/dist/js/bootstrap',
        'popper': 'popper',
        'angular': 'vendor/angular/angular',
        'angularLocale': 'vendor/angular-i18n/angular-locale_pt-br',
        'angularRoute': 'vendor/angular-ui-router/release/angular-ui-router',
        'stateEvents': 'vendor/angular-ui-router/release/stateEvents',
        'angularResource': "vendor/angular-resource/angular-resource",
        'angularCookie': 'vendor/angular-cookies/angular-cookies',
        'angularDate': 'vendor/angular-ui-date/dist/date',
        'angularAutoComplete':'vendor/angular-auto-complete/angular-auto-complete',
        'angularSanitize': 'vendor/angular-sanitize/angular-sanitize',
        'text': 'vendor/text/text',
        'lodash': 'vendor/lodash/dist/lodash'

    },
    map: {
        "*": {
            'jquery-ui/datepicker': 'vendor/jquery-ui/ui/widgets/datepicker',
            '../widgets/datepicker': 'vendor/jquery-ui/ui/widgets/datepicker'
        }
    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        lodash: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        popper: ['jquery'],
        jqueryUI: ['jquery'],
        // 'jquery-ui/datepicker': ['jqueryUI'],
        jqueryUIDatepickerPtBR:['jqueryUI'],
        bootstrap: ['jquery', 'popper'],
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularRoute': {
            exports: 'angular',
            deps: ['angular']
        },
        'angularLocale': {
            exports: 'angular',
            deps: ['angular']
        },
        'angularResource': {
            exports: 'angular',
            deps: ['angular']
        },
        'angularCookie': {
            exports: 'angular',
            deps: ['angular']
        },
        'angularDate':{
            exports: 'angular',
            deps: ['angular']
        },
        'angularSanitize':{
            exports: 'angular',
            deps: ['angular']
        },
        'angularAutoComplete':{
            exports: 'angular',
            deps: ['angular']
        },
        'stateEvents':{
            exports: 'angular',
            deps: ['angular']
        }
    },

    // kick start application
    deps: ['./app/bootstrap']
});