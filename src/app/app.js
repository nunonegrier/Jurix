/**
 * @author hebert ramos
 */
define([
    'angular',
    'popper',
    'jqueryUI',
    'jqueryUIDatepickerPtBR',
    'bootstrap',
    'lodash',
    '../modules/layout/main',
    '../modules/login/main',
    '../modules/session-user/main',
    '../modules/crud/main',
    '../modules/home/main',
    '../modules/usuario/main',
    '../modules/cliente/main',
    '../modules/localidade/main',
    '../modules/constants/main',
    '../modules/alerts/main',
    '../modules/file/main',
    '../modules/colaborador/main',
    '../modules/pauta-evento/main',
    '../modules/processos/main',
    '../modules/seguranca/main',
    '../modules/jurix-paginacao/main',
    '../modules/filtros/main',
    '../modules/financeiro/main',
    '../modules/arquivos/main',
    '../modules/relatorios/main',
    '../modules/math/main',
    '../modules/configuracao/main',
    '../modules/recuperar-senha/main',
    'angularRoute',
    'angularLocale',
    'angularResource',
    'angularCookie',
    'angularSanitize',
    'angularDate',
    'angularAutoComplete',
    'stateEvents'
], function (ng) {
    'use strict';

    return ng.module('app', [
        'ui.router', 'ui.router.state.events', 'ngResource', 'ngCookies', 'ui.date', 'ngSanitize', 'autoCompleteModule',
        'app.layout',
        'app.login',
        'app.session-user',
        'app.jurixCrud',
        'app.home',
        'app.usuario',
        'app.cliente',
        'app.localidade',
        'app.constants',
        'app.alerts',
        'app.file',
        'app.colaborador',
        'app.pautaEvento',
        'app.processo',
        'app.seguranca',
        'app.jurixPaginacao',
        'app.filtros',
        'app.financerio',
        'app.arquivos',
        'app.relatorios',
        'app.math',
        'app.configuracao',
        'app.recuperarSenha'
    ]).config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

});