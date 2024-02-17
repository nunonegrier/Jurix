define(['../../module', 'text!./view.html'], function (module, view) {

    function carregarEstados(ctrl, LocalidadeService){

        LocalidadeService.buscarEstados({size:100})
            .then(function(estados){
                ctrl.estados = estados;
            });
    }

    function iniValoresSelecao(ctrl, jurixConstants, pessoaContaService, LocalidadeService, ClienteService){

        ctrl.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:2050'
        };

        ctrl.autoCompletePessoaContaOptions = {
            minimumChars: 1,
            selectedTextAttr: 'nome',
            noMatchTemplate: '<span>Nenhum destinatário encontrado com nome "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.nome}}</p>',
            data: function (searchText) {

                ctrl.contaReceber.pessoaConta = {municipio:{}};

                return pessoaContaService.findAll({nome: searchText})
                    .then(function (pessoaContaPage_) {
                        return pessoaContaPage_.content;
                    });
            },
            itemSelected: function (e) {
                ctrl.contaReceber.pessoaConta = e.item;

                if(ctrl.contaReceber.pessoaConta.municipio) {
                    ctrl.estadoSelecionadoId = ctrl.contaReceber.pessoaConta.municipio.estado.id;
                    onSelecionarEstadoFn(ctrl, LocalidadeService)();
                }
            }
        };

        ctrl.autoCompleteOptionsCliente = {
            minimumChars: 1,
            selectedTextAttr: 'nome',
            noMatchTemplate: '<span>Nenhum cliente encontrado com nome "{{entry.searchText}}"</span>',
            itemTemplate: '<p>{{entry.item.nome}}</p>',
            data: function (searchText) {

                ctrl.contaReceber.cliente = null;

                return ClienteService.findAll({nome: searchText})
                    .then(function (clientesPage_) {
                        return clientesPage_.content;
                    });
            },
            itemSelected: function (e) {
                ctrl.contaReceber.cliente = e.item;
            }
        };
    }

    function onSelecionarEstadoFn(ctrl, LocalidadeService){

        return function() {

            LocalidadeService.buscarMunicipios(ctrl.estadoSelecionadoId)
                .then(function (municipios) {
                    ctrl.municipios = municipios;
                });
        }
    }

    function initNovaConta(ctrl, centroCusto){

        ctrl.contaReceber = {
            pessoaConta:{municipio:{}},
            incidencias: [{centroCusto:centroCusto, incidencia: 100}]
        };
        ctrl.pessoaContaNome = null;
        ctrl.clienteNome = null;
        ctrl.pagamentoParcelado = 'N';

        ctrl.titulo = 'Nova Conta';
        ctrl.estadoSelecionadoId = null;

        angular.element('#novaContaReceber').modal('show');
    }

    function initEdicaoConta(ctrl, LocalidadeService, contasReceberService, contaReceber_){

        contasReceberService.findById(contaReceber_.id)
            .then(function(contaReceber){

                ctrl.contaReceber = contaReceber;
                ctrl.pessoaContaNome = contaReceber.pessoaConta.nome;
                ctrl.clienteNome = contaReceber.cliente.nome;
                ctrl.pagamentoParcelado = ctrl.contaReceber.pagamentoParcelado ? 'S' : 'N';


                ctrl.titulo = 'Editar Conta';


                if(contaReceber.pessoaConta.municipio){
                    ctrl.estadoSelecionadoId = contaReceber.pessoaConta.municipio.estado.id;
                    onSelecionarEstadoFn(ctrl, LocalidadeService)();
                }else{
                    ctrl.estadoSelecionadoId = null;
                    contaReceber.pessoaConta.municipio = {};
                }

                angular.element('#novaContaReceber').modal('show');

            });
    }

    function salvarContaFn(ctrl, $rootScope, contasReceberService){
        return function(){

            var form = angular.element('#contasReceberForm')[0];

            angular.element('#contasReceberForm').find('.is-invalid').removeClass('is-invalid');

            if (form.checkValidity()){

                if(totalIncidenciasInvalido(ctrl)){
                    alert('O total das incidências de centro de custo deve ser 100%')
                    return;
                }

                ctrl.contaReceber.pagamentoParcelado = ctrl.pagamentoParcelado == 'S';
                ctrl.contaReceber.pessoaConta.nome = ctrl.pessoaContaNome;

                contasReceberService.save(ctrl.contaReceber)
                    .then(function(){
                        angular.element('#novaContaReceber').modal('hide');
                        $rootScope.$broadcast('CONTA_SALVA');
                    })
                    .catch(function(){
                        alert('erro')
                    })
            }else{
                console.log(angular.element('#contasReceberForm').find('.ng-invalid'));
                angular.element('#contasReceberForm').find('.ng-invalid').addClass('is-invalid');
            }
        };
    }

    function totalIncidenciasInvalido(ctrl){

        var total = ctrl.contaReceber.incidencias.reduce(function(total, incidenciaConta){
            return  parseInt(total) + parseInt(incidenciaConta.incidencia);
        }, 0);

        return total != 100;
    }

    function incluirCentroIncidenciaFn(ctrl){
        return  function(){
            ctrl.contaReceber.incidencias.push({centroCusto:{}, incidencia: 0});
        };
    }

    function removerCentroIncidenciaFn(ctrl){
        return  function(index){
            ctrl.contaReceber.incidencias.splice(index, 1);
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
            for(var i = 0; i <  ctrl.contaReceber.incidencias.length; i++){
                var incidencia =  ctrl.contaReceber.incidencias[i];
                incidencia.valor = getValorPercentual( ctrl.contaReceber.valorReceber, incidencia.incidencia);

                if( ctrl.contaReceber.incidencias.length > 1 && i != ( ctrl.contaReceber.incidencias.length - 1)){
                    totalParcial = totalParcial + incidencia.valor;
                }
            }

            if( ctrl.contaReceber.incidencias.length > 1){
                var incidencia =  ctrl.contaReceber.incidencias[ ctrl.contaReceber.incidencias.length - 1];
                incidencia.valor = arredondar( ctrl.contaReceber.valorReceber - totalParcial);
            }
        };
    }

    module.component('contasReceberForm', {
        template: view,
        bindings: {
            centrosCusto: '='
        },
        controller: ['$rootScope', 'jurixConstants', 'contasReceberService', 'LocalidadeService', 'pessoaContaService', 'ClienteService',
            function ($rootScope, jurixConstants, contasReceberService, LocalidadeService, pessoaContaService, ClienteService) {

                var ctrl = this;

                ctrl.$onInit = function () {
                    carregarEstados(ctrl, LocalidadeService);
                    iniValoresSelecao(ctrl, jurixConstants, pessoaContaService, LocalidadeService, ClienteService);
                };

                $rootScope.$on('NOVA_CONTA_RECEBER', function(ev, centroCusto){
                    initNovaConta(ctrl, centroCusto);
                });

                $rootScope.$on('EDITAR_CONTA_RECEBER', function(ev, contaReceber){
                    initEdicaoConta(ctrl, LocalidadeService, contasReceberService, contaReceber);
                });

                ctrl.salvar = salvarContaFn(ctrl, $rootScope, contasReceberService);

                ctrl.onSelecionarEstado = onSelecionarEstadoFn(ctrl, LocalidadeService);

                ctrl.incluirCentroIncidencia = incluirCentroIncidenciaFn(ctrl);

                ctrl.removerCentroIncidencia = removerCentroIncidenciaFn(ctrl);

                ctrl.onMudarIncidencia = onMudarIncidenciaFn(ctrl);
            }]
    });

});