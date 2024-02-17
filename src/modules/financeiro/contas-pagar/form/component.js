define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';


    function initNovaConta(ctrl, centroCusto){

        ctrl.contaPagar = {
            repetirValor: false,
            pessoaConta:{municipio:{}},
            incidencias: [{centroCusto:centroCusto, incidencia: 100}]
        };
        ctrl.pessoaContaNome = null;

        ctrl.repetirValor = 'N';
        ctrl.titulo = 'Nova Conta';
        ctrl.estadoSelecionadoId = null;

        angular.element('#novaContaPagar').modal('show');
    }

    function initEdicaoConta(ctrl, LocalidadeService, contasPagarService, contaPagar_){

        contasPagarService.findById(contaPagar_.id)
            .then(function (contaPagar) {

                ctrl.contaPagar = contaPagar;
                ctrl.pessoaContaNome = contaPagar.pessoaConta.nome;

                ctrl.repetirValor = ctrl.contaPagar.repetirValo ? 'S' : 'N';
                ctrl.titulo = 'Editar Conta';

                if(contaPagar.pessoaConta.municipio){
                    ctrl.estadoSelecionadoId = contaPagar.pessoaConta.municipio.estado.id;
                    onSelecionarEstadoFn(ctrl, LocalidadeService)();
                }else{
                    ctrl.estadoSelecionadoId = null;
                    contaPagar.pessoaConta.municipio = {};
                }

                angular.element('#novaContaPagar').modal('show');

            });
    }

    function iniValoresSelecao(ctrl, jurixConstants, pessoaContaService, LocalidadeService, centrosCusto){
        ctrl.tiposContaPagar = jurixConstants.ENUM.EnumTipoContasPagar;
        ctrl.frequenciaContasPagar = jurixConstants.ENUM.EnumFrequenciaContasPagar;

        ctrl.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

        ctrl.autoCompletePessoaContaOptions = {
            minimumChars: 1,
            selectedTextAttr: 'nome',
            noMatchTemplate: '<span>Nenhum destinatário encontrado com nome "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.nome}}</p>',
            data: function (searchText) {

                ctrl.contaPagar.pessoaConta = {municipio:{}};

                return pessoaContaService.findAll({nome: searchText})
                    .then(function (pessoaContaPage_) {
                        return pessoaContaPage_.content;
                    });
            },
            itemSelected: function (e) {
                ctrl.contaPagar.pessoaConta = e.item;

                if(ctrl.contaPagar.pessoaConta.municipio) {
                    ctrl.estadoSelecionadoId = ctrl.contaPagar.pessoaConta.municipio.estado.id;
                    onSelecionarEstadoFn(ctrl, LocalidadeService)();
                }
            }
        };

    }

    function salvarContaFn(ctrl, $rootScope, contasPagarService){
        return function(){

            var form = angular.element('#contasPagarForm')[0];

            angular.element('#contasPagarForm').find('.is-invalid').removeClass('is-invalid');

            if (form.checkValidity()){

                if(totalIncidenciasInvalido(ctrl)){
                    alert('O total das incidências de centro de custo deve ser 100%')
                    return;
                }

                ctrl.contaPagar.repetirValor = ctrl.repetirValor == 'S';
                ctrl.contaPagar.pessoaConta.nome = ctrl.pessoaContaNome;

                contasPagarService.save(ctrl.contaPagar)
                    .then(function(){
                        angular.element('#novaContaPagar').modal('hide');
                        $rootScope.$broadcast('CONTA_SALVA');
                    })
                    .catch(function(){
                        alert('erro')
                    })
            }else{
                angular.element('#contasPagarForm').find('.ng-invalid').addClass('is-invalid');
            }
        };
    }

    function totalIncidenciasInvalido(ctrl){

        var total = ctrl.contaPagar.incidencias.reduce(function(total, incidenciaConta){
           return  parseFloat(total) + parseFloat(incidenciaConta.incidencia);
        }, 0);

        console.log(total);

        return total != 100;
    }

    function carregarEstados(ctrl, LocalidadeService){

        LocalidadeService.buscarEstados({size:100})
            .then(function(estados){
                ctrl.estados = estados;
            });
    }

    function onSelecionarEstadoFn(ctrl, LocalidadeService){

        return function() {

            LocalidadeService.buscarMunicipios(ctrl.estadoSelecionadoId)
                .then(function (municipios) {
                    ctrl.municipios = municipios;
                });
        }
    }

    function incluirCentroIncidenciaFn(ctrl){
        return  function(){
            ctrl.contaPagar.incidencias.push({centroCusto:{}, incidencia: 0});
        };
    }

    function removerCentroIncidenciaFn(ctrl){
        return  function(index){
            ctrl.contaPagar.incidencias.splice(index, 1);
        };
    }

    function arredondar(valor){
        return parseFloat(valor.toFixed(2));
    }

    function getValorPercentual(valorTotal, percentual){

        var valorPercentual = (valorTotal * percentual);
        valorPercentual = valorPercentual / (100);
        return arredondar(valorPercentual);
    }

    function onMudarIncidenciaFn(ctrl){
        return function(){

            var totalParcial = 0;
            for(var i = 0; i < ctrl.contaPagar.incidencias.length; i++){
                var incidencia = ctrl.contaPagar.incidencias[i];
                incidencia.valor = getValorPercentual(ctrl.contaPagar.valor, incidencia.incidencia);

                if(ctrl.contaPagar.incidencias.length > 1 && i != (ctrl.contaPagar.incidencias.length - 1)){
                    totalParcial = totalParcial + incidencia.valor;
                }
            }

            if(ctrl.contaPagar.incidencias.length > 1){
                var incidencia = ctrl.contaPagar.incidencias[ctrl.contaPagar.incidencias.length - 1];
                incidencia.valor = arredondar(ctrl.contaPagar.valor - totalParcial);
            }
        };
    }

    module.component('contasPagarForm', {
        template: view,
        bindings: {
            centrosCusto: '='
        },
        controller: ['$rootScope', 'jurixConstants', 'contasPagarService', 'LocalidadeService', 'pessoaContaService',
            function($rootScope, jurixConstants, contasPagarService, LocalidadeService, pessoaContaService){

            var ctrl = this;

            ctrl.$onInit = function () {
                carregarEstados(ctrl, LocalidadeService);
                iniValoresSelecao(ctrl, jurixConstants, pessoaContaService, LocalidadeService, ctrl.centrosCusto);
            };

            $rootScope.$on('NOVA_CONTA_PAGAR', function(ev, centroCusto){
                initNovaConta(ctrl, centroCusto);
            });

            $rootScope.$on('EDITAR_CONTA_PAGAR', function(ev, contaPagar){
                initEdicaoConta(ctrl, LocalidadeService, contasPagarService, contaPagar);
            });

            ctrl.salvar = salvarContaFn(ctrl, $rootScope, contasPagarService);

            ctrl.onSelecionarEstado = onSelecionarEstadoFn(ctrl, LocalidadeService);

            ctrl.incluirCentroIncidencia = incluirCentroIncidenciaFn(ctrl);

            ctrl.removerCentroIncidencia = removerCentroIncidenciaFn(ctrl);

            ctrl.onMudarIncidencia = onMudarIncidenciaFn(ctrl);
        }]
    });
});