define(['../module', 'text!./view.html'], function (module, view) {
    'use strict';

    function novaContaPagarFn(ctrl, $rootScope) {
        return function () {
            $rootScope.$broadcast('NOVA_CONTA_PAGAR', ctrl.centroCusto);
        };
    }

    function visulizarContaPagarFn($scope) {
        return function (contasPagar) {
            $scope.$root.$broadcast('VISUALIZAR_CONTA_PAGAR', contasPagar);
        }
    }

    function salvarValorFn($rootScope, contasPagarService){
        return function (contaPagarModel) {

            contaPagarModel.valor = contaPagarModel.novoValor;

            contasPagarService.save(contaPagarModel)
                .then(function () {
                    $rootScope.$broadcast('CONTA_SALVA');
                })
                .catch(function () {
                    alert('erro')
                });
        };
    }

    function removerContaFn($rootScope){
        return function(contaPagarModel){
            $rootScope.$broadcast('REMOVER_CONTA', contaPagarModel, 'CONTA_PAGAR');
        };
    }

    function exibirContaFn(ctrl){
        return function(contaPagarModel){

            if(!ctrl.filters.mostrarFinalizados && contaPagarModel.situacao === 'PAGA'){
                return false;
            }

            return true;
        };
    }

    function selecionarDiasVencimentoFn($rootScope){
        return function(diasVencimento){
            $rootScope.$broadcast('BUSCAR_CONTAS_ULTIMOS_DIAS', diasVencimento);
        };
    }

    function lastday (y,m){
        return new Date(y, m, 0).getDate();
    }

    function pesquisarDatasFn(ctrl, $rootScope){
        return function(){

            if(ctrl.filters.dataInicio && ctrl.filters.dataFinal){
                $rootScope.$broadcast('BUSCAR_CONTAS_ENTRE_DIAS', ctrl.filters.dataInicio, ctrl.filters.dataFinal);
            }
        };
    }

    function getValorPercentualFn(ctrl){
        return function(contaPagar){
            var incidencia = getIncidenciaControCusto(contaPagar, ctrl.centroCusto);
            return incidencia ? incidencia.valor : 0;
        };
    }

    function getIncidenciaControCusto(contaPagar, centroCusto){
        return contaPagar.incidencias.filter(function(incidencia){
            return  incidencia.centroCusto.id == centroCusto.id;
        })[0];
    }

    function getPercentualFn(ctrl, $filter){
        return function(contaPagar){
            var incidencia = getIncidenciaControCusto(contaPagar, ctrl.centroCusto);
            return incidencia ? $filter('number')(incidencia.incidencia, 2).replace(',00', '') : 0;
        };
    }

    function getSituacao(contasPagar){
        if(!contasPagar.isAtrasado && contasPagar.situacao === 'PENDENTE'){
            return 'Pendente';
        }else if(contasPagar.isAtrasado && contasPagar.situacao === 'PENDENTE'){
            return 'Atrasada';
        }else if(contasPagar.situacao === 'PAGA'){
            return 'Paga';
        }
        return '';
    }

    function gerarPdfXls(ctrl, $filter){
        return function(type_){

            if(type_ == 'PDF'){

                var colunas = ['Descrição', 'Tipo', 'Vencimento', 'Valor', 'Situação'];

                var linhas = [];

                ctrl.contasPagar.forEach(function(contaPagarModel){
                    var linha = [];

                    linha.push(contaPagarModel.descricao + '  - ' + ctrl.getPercentual(contaPagarModel) + '%');
                    linha.push($filter('jurixEnumFilter')(contaPagarModel.tipo, 'EnumTipoContasPagar'));
                    linha.push($filter('date')(contaPagarModel.dataVencimento, 'dd/MM/yyyy'));
                    linha.push($filter('currency')(ctrl.getValorPercentual(contaPagarModel)));
                    linha.push(getSituacao(contaPagarModel));

                    linhas.push(linha);
                });


                var doc = new jsPDF({ orientation: 'landscape'});
                doc.autoTable({
                    head: [colunas],
                    body: linhas,
                    styles:{
                        cellWidth:'wrap',
                        fontSize:10
                    }

                });
                doc.save('Contas-Receber.pdf');
            }else{


                var linhas = [];

                ctrl.contasPagar.forEach(function(contaPagarModel){

                    var linha = {
                        'Descrição': contaPagarModel.descricao + '  - ' + ctrl.getPercentual(contaPagarModel) + '%',
                        'Tipo': $filter('jurixEnumFilter')(contaPagarModel.tipo, 'EnumTipoContasPagar'),
                        'Vencimento': $filter('date')(contaPagarModel.dataVencimento, 'dd/MM/yyyy'),
                        'Valor': $filter('currency')(ctrl.getValorPercentual(contaPagarModel)),
                        'Situação': getSituacao(contaPagarModel)
                    };

                    linhas.push(linha);
                });


                /* generate a worksheet */
                var ws = XLSX.utils.json_to_sheet(linhas);

                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Contas");

                /* write workbook and force a download */
                XLSX.writeFile(wb, "Contas-Receber.xlsx");

            }
        }
    }


    module.component('contasPagarGrid', {
        template: view,
        bindings: {
            contasPagar: '=',
            centroCusto: '=',
            centrosCusto: '=',
            mes: '<',
            ano: '<'
        },
        controller: ['$rootScope', 'contasPagarService', '$filter', function ($rootScope, contasPagarService, $filter) {

            var ctrl = this;

            ctrl.filters = {
                mostrarFinalizados:true,
                dataInicio:null,
                dataFinal: null
            };

            ctrl.$onChanges = function(){
                ctrl.dateOptionsPagar = {
                    minDate: '01/' + ctrl.mes + '/' + ctrl.ano,
                    maxDate: lastday(ctrl.ano, ctrl.mes) + '/' + ctrl.mes + '/' + ctrl.ano,
                    hideIfNoPrevNext: true
                };
                ctrl.filters.dataInicio = null;
                ctrl.filters.dataFinal = null;
             };

            ctrl.novaContaPagar = novaContaPagarFn(ctrl, $rootScope);

            ctrl.salvarValor = salvarValorFn($rootScope, contasPagarService);

            ctrl.visulizarContaPagar = visulizarContaPagarFn($rootScope);

            ctrl.removerConta = removerContaFn($rootScope);

            ctrl.exibirConta = exibirContaFn(ctrl);

            ctrl.selecionarDiasVencimento = selecionarDiasVencimentoFn($rootScope);

            ctrl.pesquisarDatas = pesquisarDatasFn(ctrl, $rootScope);

            ctrl.getValorPercentual = getValorPercentualFn(ctrl);

            ctrl.getPercentual = getPercentualFn(ctrl, $filter);

            ctrl.gerarPdfXls = gerarPdfXls(ctrl, $filter);
        }]
    });
});