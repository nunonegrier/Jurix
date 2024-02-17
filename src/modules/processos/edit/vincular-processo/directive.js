define(['../../module', 'text!./view.html', 'angular'], function (module, view, angular) {
    'use strict';

    function iniciarCamposBusca($scope) {
        $scope.camposBusca = {
            numeroProcesso:  null,
            nomeParte: null,
            numeroProcessoAutoComplete: null
        };
    }

    function setProcessoAtual($scope, processo){
        if(processo.id) {
            $scope.processoAtual = processo;
        }
    }

    function addHandlers($scope) {

        $scope.$on('INIT_VINCULAR_PROCESSO', function (ev, processo) {
            iniciarCamposBusca($scope);
            setProcessoAtual($scope, processo);
            angular.element('#vincularProcessoModal').modal("show");
        });
    }

    function pesquisarFn($scope, ProcessoService) {
        return function () {
            ProcessoService.findAll({numeroDescricao: $scope.camposBusca.numeroProcesso, nomeParte: $scope.camposBusca.nomeParte})
                .then(function (processoPage_) {
                    setProcessos($scope, processoPage_.content);
                });
        }
    }

    function setProcessos($scope, processos) {
        $scope.processos = processos;
    }

    function selecionarProcessoVinculoFn($scope){
        return function(processo){
            enviarEventoVincular($scope, processo);
        };
    }

    function enviarEventoVincular($scope, processo){
        $scope.$root.$broadcast('VINCULAR_PROCESSO', processo);
        angular.element('#vincularProcessoModal').modal("hide");
    }

    function vincularSelecionadoFn($scope){
        return function(){
            if($scope.processoSelecionado){
                enviarEventoVincular($scope, $scope.processoSelecionado);
            }
        };
    }

    function getAutoCompleteVincularOptions($scope, ProcessoService){
        return {
            minimumChars: 1,
            selectedTextAttr: 'numero',
            noMatchTemplate: '<span>Nenhum processo encontrado com número "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.numero}}</p>',
            data: function (searchText) {

                $scope.processoSelecionado = null;

                return  ProcessoService.findAll({numero: searchText})
                    .then(function (processoPage_) {
                        return processoPage_.content;
                    });
            },
            itemSelected: function (e) {
                $scope.processoSelecionado = e.item;
            }
        };
    }


    module.directive('vincularProcesso', ['ProcessoService', function (ProcessoService) {

        return {
            restrict: 'E',
            template: view,
            scope: {},
            controller: ['$scope', function ($scope) {

                addHandlers($scope);
                setProcessos($scope, []);

                $scope.pesquisar = pesquisarFn($scope, ProcessoService);
                $scope.selecionarProcessoVinculo = selecionarProcessoVinculoFn($scope);
                $scope.vincularSelecionado = vincularSelecionadoFn($scope);

                $scope.processoSelecionado = null;
                $scope.autoCompleteVincularOptions = getAutoCompleteVincularOptions($scope, ProcessoService);

            }]
        };
    }]);
});