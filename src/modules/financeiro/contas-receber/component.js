define(['../module', 'text!./view.html'], function (module, view) {
    'use strict';

    function novaContaReceberFn(ctrl, $rootScope) {
        return function () {
            $rootScope.$broadcast('NOVA_CONTA_RECEBER', ctrl.centroCusto);
        };
    }

    function removerContaFn($rootScope){
        return function(contaPagarModel){
            $rootScope.$broadcast('REMOVER_CONTA', contaPagarModel, 'CONTA_RECEBER');
        };
    }

    function visulizarContaReceberFn($scope) {
        return function (contaReceber) {
            $scope.$root.$broadcast('VISUALIZAR_CONTA_RECEBER', contaReceber);
        }
    }

    function novoValorExtraordinarioReceberFn($rootScope) {
        return function (contaReceber) {
            $rootScope.$broadcast('NOVO_VALOR_EXTRAORDINARIO_RECEBER', contaReceber);
        }
    }

    function exibirContaFn(ctrl){
        return function(contaReceberModel){

            if(!ctrl.filters.mostrarFinalizados && contaReceberModel.situacao === 'RECEBIDO'){
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
        return function(contaReceber){
            var incidencia = getIncidenciaControCusto(contaReceber, ctrl.centroCusto);
            return incidencia ? incidencia.valor : 0;
        };
    }

    function getIncidenciaControCusto(contaReceber, centroCusto){
        return contaReceber.incidencias.filter(function(incidencia){
            return  incidencia.centroCusto.id == centroCusto.id;
        })[0];
    }

    function getPercentualFn(ctrl, $filter){
        return function(contaReceber){
            var incidencia = getIncidenciaControCusto(contaReceber, ctrl.centroCusto);
            return incidencia ? $filter('number')(incidencia.incidencia, 2).replace(',00', '') : 0;
        };
    }

    function getSituacao(contaReceber){
        if(!contaReceber.isAtrasado && contaReceber.situacao === 'PENDENTE'){
            return 'Pendente';
        }else if(contaReceber.isAtrasado && contaReceber.situacao === 'PENDENTE'){
            return 'Atrasada';
        }else if(contaReceber.situacao === 'RECEBIDO'){
            return 'Paga';
        }
        return '';
    }

    function gerarPdfXls(ctrl, $filter){
        return function(type_){

            if(type_ == 'PDF'){

                var colunas = ['Descrição', 'Tipo', 'Vencimento', 'Valor', 'Situação'];

                var linhas = [];

                ctrl.contasReceber.forEach(function(contaReceberModel){
                    var linha = [];

                    linha.push(contaReceberModel.descricao + '  - ' + ctrl.getPercentual(contaReceberModel) + '%');
                    linha.push(contaReceberModel.contrato ?  $filter('jurixEnumFilter')(contaReceberModel.contrato.tipoContrato, 'EnumTipoContrato') : 'Extraordinária');
                    linha.push($filter('date')(contaReceberModel.dataReceber, 'dd/MM/yyyy'));
                    linha.push($filter('currency')(ctrl.getValorPercentual(contaReceberModel)));
                    linha.push(getSituacao(contaReceberModel));

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

                ctrl.contasReceber.forEach(function(contaReceberModel){

                    var linha = {
                        'Descrição': contaReceberModel.descricao + '  - ' + ctrl.getPercentual(contaReceberModel) + '%',
                        'Tipo': contaReceberModel.contrato ?  $filter('jurixEnumFilter')(contaReceberModel.contrato.tipoContrato, 'EnumTipoContrato') : 'Extraordinária',
                        'Vencimento': $filter('date')(contaReceberModel.dataReceber, 'dd/MM/yyyy'),
                        'Valor': $filter('currency')(ctrl.getValorPercentual(contaReceberModel)),
                        'Situação': getSituacao(contaReceberModel)
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

    module.component('contasReceberGrid', {
        template: view,
        bindings: {
            contasReceber: '=',
            centroCusto: '=',
            centrosCusto: '=',
            mes: '<',
            ano: '<'
        },
        controller: ['$rootScope', '$filter', function ($rootScope, $filter) {

            var ctrl = this;

            ctrl.filters = {
                mostrarFinalizados:true,
                dataInicio:null,
                dataFinal: null
            };

            ctrl.$onChanges = function(){
                ctrl.dateOptionsReceber = {
                    minDate: '01/' + ctrl.mes + '/' + ctrl.ano,
                    maxDate: lastday(ctrl.ano, ctrl.mes) + '/' + ctrl.mes + '/' + ctrl.ano,
                    hideIfNoPrevNext: true
                };
                ctrl.filters.dataInicio = null;
                ctrl.filters.dataFinal = null;
            };

            ctrl.visulizarContaReceber = visulizarContaReceberFn($rootScope);

            ctrl.novaContaReceber = novaContaReceberFn(ctrl, $rootScope);

            ctrl.removerConta = removerContaFn($rootScope);

            ctrl.novoValorExtraordinarioReceber = novoValorExtraordinarioReceberFn($rootScope);

            ctrl.exibirConta = exibirContaFn(ctrl);

            ctrl.selecionarDiasVencimento = selecionarDiasVencimentoFn($rootScope);

            ctrl.pesquisarDatas = pesquisarDatasFn(ctrl, $rootScope);

            ctrl.getValorPercentual = getValorPercentualFn(ctrl);

            ctrl.getPercentual = getPercentualFn(ctrl, $filter);

            ctrl.gerarPdfXls = gerarPdfXls(ctrl, $filter);
        }]
    });
});