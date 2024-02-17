/**
 * @author hebert ramos
 */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');


    var paths = {
      src: 'src',
      dist: 'dist'
    };


    var configs = {

        requirejs:{
            minifyJs: {
                options: {
                    name: 'main',
                    baseUrl: 'src',
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
                    packages: [''],
                    deps: [
                        'jquery',
                        'angular',
                        'text',
                        'bootstrap',
                        'domReady',
                        'angularRoute',
                        'angularLocale',
                        'angularResource',
                        'angularCookie',
                        'angularSanitize',
                        'angularDate',
                        'angularAutoComplete',
                        'stateEvents',
                        './app/bootstrap'
                    ],
                    out: 'dist/main.js',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    optimize: 'uglify2',
                    uglify2: {
                        mangle: {
                            except: ['$super', '$rootScope', '$state']
                        }
                    }
                }
            }
        },
        cssmin:{
            minifyCss:{
                src:[
                    'src/assets/css/bootstrap.css',
                    'src/assets/css/sticky-footer-navbar.css',
                    'src/vendor/components-font-awesome/css/fontawesome-all.css',
                    'src/vendor/jquery-ui/themes/smoothness/jquery-ui.css',
                    'src/vendor/angular-auto-complete/angular-auto-complete.css'
                ],
                dest: 'src/assets/css/main.css'
            }
        },
        copy:{
            dist: {
                expand: true,
                cwd: 'src',
                src: [
                    'index.html',
                    'popper.js',
                    'vendor/requirejs/**',
                    'assets/css/main.css',
                    'assets/css/jurix.css',
                    'assets/css/fonts/**',
                    'assets/css/images/**',
                    'assets/js/respond.min.js',
                    'assets/img/**',
                    'assets/webfonts/**',
                    'es6libs/**',
                    'vendor/js-xlsx/**'
                ],
                dest:'dist'
            }
            //COPIAR WEB fonts
        }

    };

    grunt.initConfig(configs);


    grunt.registerTask('minify', ['requirejs', 'copy']);
};