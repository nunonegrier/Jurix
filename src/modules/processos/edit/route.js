define(['../module', 'text!./view.html', 'text!./menu.html', 'angular'], function (app, editView, editMenu, angular) {


    'use strict';
    return app.config(['$stateProvider', function ($stateProvider) {

        var viewsEdit = {
            content: {
                template: editView,
                controller: 'editProcessoController'
            },
            'menu-superior':{
                template: editMenu,
                controller:['$scope', '$state', function($scope, $state){

                    $scope.rotaVoltarPara = $state.params.rotaVoltarPara;
                    $scope.paramsVoltarPara = $state.params.paramsVoltarPara;

                    $scope.getStateVoltar = function(){

                        if($scope.rotaVoltarPara){
                            var urlState = $scope.rotaVoltarPara;
                            if($scope.paramsVoltarPara) {
                                urlState += '(' + JSON.stringify($scope.paramsVoltarPara) +')';
                            }
                            return urlState;
                        }

                        return 'layout.processoList({manterParametroBusca:true})';
                    };
                }]
            }
        };


        var resolveBase = {

            processoDto: ['$stateParams', 'ProcessoService', function($stateParams, ProcessoService){
                if($stateParams.id) {
                 return ProcessoService.findByIdMarcaRecente($stateParams.id);
                }
                return {processo: {contrato:{cliente:{}}, tipoAcao:{}, comarca:{}, centroCusto:{}}, partesCliente:[], partesContraria:[]};
            }],
            tiposAcao:['TipoAcaoService', function(TipoAcaoService){
                return TipoAcaoService.findAll()
                    .then(function(tipoAcaoPage){
                        return tipoAcaoPage._embedded.tipoAcao;
                    });
            }],
            centrosCusto:['CentroCustoService', function(CentroCustoService){
                return CentroCustoService.findAll()
                    .then(function(centroCustoPage){
                        return centroCustoPage._embedded.centroCusto;
                    });
            }],
            cliente: ['$stateParams', 'ClienteService', function ($stateParams, ClienteService) {
                if($stateParams.clienteId) {
                    return ClienteService.findById($stateParams.clienteId);
                }

                return null;
            }],
            contrato:['$stateParams', 'ContratoService', function($stateParams, ContratoService){
                if($stateParams.contratoId) {
                    return ContratoService.findById($stateParams.contratoClienteId, $stateParams.contratoId);
                }

                return null;
            }],
            estados:['LocalidadeService', function(LocalidadeService){
                return LocalidadeService.buscarEstados({size:100});
            }],
            isFromNovo: ['$stateParams', function($stateParams) {
                return $stateParams.isFromNovo;
            }]
        };

        var novoResolve = angular.copy(resolveBase);
        novoResolve['acao'] = function () {
            return 'novo';
        };

        var editResolve = angular.copy(resolveBase);
        editResolve['acao'] = function () {
            return 'edit';
        };

        $stateProvider.state('layout.processoNovo', {
            id: 'processos',
            url: '^/processos/novo',
            jurixPermissoes:'Processo.Cadastrar',
            views: viewsEdit,
            resolve: novoResolve,
            params: {
                isFromNovo: null,
                clienteId:null,
                contratoId:null,
                contratoClienteId:null
            }
        });

        $stateProvider.state('layout.processoEditar', {
            id:'clientes',
            url: '^/processos/editProcesso/:id',
            jurixPermissoes:'Processo.Editar',
            views: viewsEdit,
            resolve: editResolve,
            params: {
                isFromNovo:null,
                rotaVoltarPara:null,
                paramsVoltarPara:null
            }
        });

    }]);
});