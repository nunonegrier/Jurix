define(['./module'], function (module) {
    'use strict';

    function atualizarContasFn($scope, financeiroService) {
        return function (ultimosDias) {

            var params = {
                centroCustoId: $scope.centroCusto.id,
                mes: $scope.mesAtual,
                ano:$scope.anoAtual,
                diasVencimento: ultimosDias,
                tipoCompartilhado: $scope.tipoCompartilhado
            };

            financeiroService.buscarDadosFinanceirosParams(params)
                .then(function (financeiroDTO) {
                    $scope.financeiroDTO = financeiroDTO;
                });
        };
    }

    function confirmarRemoverContaFn($scope, contasPagarService, contasReceberService) {
        return function () {

            var promise = null;
            if ($scope.tipoConta == 'CONTA_RECEBER') {
                promise = contasReceberService.delete($scope.contaRemover.id)
            } else {
                promise = contasPagarService.delete($scope.contaRemover.id)
            }

            promise
                .then(function () {
                    angular.element('#despesaApagar').modal('hide');
                    $scope.$root.$broadcast('CONTA_SALVA');
                })
                .catch(function () {
                    alert('erro')
                })
        };
    }

    function buscarContasUltimosDiasFn($scope){
        return function(ev, ultimosDias){
            $scope.iniciarDataAtual();
            $scope.atualizarContaFn(ultimosDias);
        };
    }

    function buscarContasEntreDiasFn($scope, financeiroService){

        return function(ev, dataInicio, dataFinal) {
            var params = {
                centroCustoId: $scope.centroCusto.id,
                mes: $scope.mesAtual,
                ano: $scope.anoAtual,
                dataInicio: dataInicio,
                dataFim: dataFinal
            };

            financeiroService.buscarDadosFinanceirosParams(params)
                .then(function (financeiroDTO) {
                    $scope.financeiroDTO = financeiroDTO;
                });
        };
    }

    function setCentroCustoDefault($scope, financeiroService){
        financeiroService.setCentroCustoDefault($scope.centroCusto.id);
    }

    module.controller('financeiroController', ['$scope', 'financeiroDTO', 'centroCusto', 'serverDataHora', 'centrosCusto', 'financeiroService', 'contasPagarService', 'contasReceberService',
        function ($scope, financeiroDTO, centroCusto, serverDataHora, centrosCusto, financeiroService, contasPagarService, contasReceberService) {


            $scope.financeiroDTO = financeiroDTO;
            $scope.centroCusto = centroCusto;
            $scope.centrosCusto = centrosCusto;
            $scope.tipoCompartilhado = null;
            $scope.tiposCompartilhado = [
                {id: null, nome: 'Todos'},
                {id: 'COMPARTILHADOS', nome: 'Compartilhados'},
                {id: 'NAO_COMPARTILHADOS', nome: 'Não Compartilhados'}
            ];

            $scope.iniciarDataAtual = function (){
                $scope.mesAtual = serverDataHora.getMonth() + 1;
                $scope.anoAtual = serverDataHora.getFullYear();
            };

            $scope.atualizarContaFn = atualizarContasFn($scope, financeiroService);

            $scope.$on('CONTA_SALVA', function(){
                $scope.atualizarContaFn();
            });

            $scope.$on('REMOVER_CONTA', function (evt, contaRemover, tipoConta) {
                $scope.contaRemover = contaRemover;
                $scope.tipoConta = tipoConta;
                angular.element('#despesaApagar').modal('show');
            });

            $scope.$on('BUSCAR_CONTAS_ULTIMOS_DIAS', buscarContasUltimosDiasFn($scope));

            $scope.$on('BUSCAR_CONTAS_ENTRE_DIAS', buscarContasEntreDiasFn($scope, financeiroService));

            $scope.confirmarRemoverConta = confirmarRemoverContaFn($scope, contasPagarService, contasReceberService);

            $scope.iniciarDataAtual();

            $scope.irMesAnterior = function(){

                $scope.mesAtual = $scope.mesAtual - 1;

                if($scope.mesAtual == 0){
                    $scope.anoAtual = $scope.anoAtual - 1;
                    $scope.mesAtual = 12;
                }

                $scope.atualizarContaFn();
            };

            $scope.irProximoMes = function(){

                $scope.mesAtual = $scope.mesAtual + 1;
                if($scope.mesAtual == 13){
                    $scope.anoAtual = $scope.anoAtual + 1;
                    $scope.mesAtual = 1;
                }

                $scope.atualizarContaFn();
            };

            $scope.voltarAoMesInicial = function(){

                $scope.iniciarDataAtual();
                $scope.atualizarContaFn();
            };

            $scope.podeIrProximoMes = function(){

                if($scope.anoAtual == serverDataHora.getFullYear()){

                    if(($scope.mesAtual + 1) > serverDataHora.getMonth() + 1){
                        return false;
                    }
                }
                return true;
            };

            $scope.mapaMeses = ['init', 'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

            $scope.getDecimals = function(number){
                var stringNumber = number.toString();
                if(stringNumber.indexOf('.') !== -1){
                   var decimal = stringNumber.split('.')[1];
                   if(decimal.length === 1){
                       decimal += '0';
                   }
                   return decimal.substring(0, 2);
                }
                return '00';
            };

            $scope.getInteger = function(number){
                var stringNumber = number.toString();
                if(stringNumber.indexOf('.') !== -1){
                    return stringNumber.split('.')[0];
                }
                return stringNumber;
            };

            $scope.onChangeCentroCusto = function(){
                $scope.atualizarContaFn();
                setCentroCustoDefault($scope, financeiroService);
                $scope.centrosCusto.forEach(function(centroC){
                    if(centroC.id == $scope.centroCusto.id){
                        $scope.centroCusto.descricao = centroC.descricao;
                    }
                });
            };

            $scope.onChangeTipoCompartilhado = function(){
                $scope.atualizarContaFn();
            };

            $scope.datasFiltro = {
                dataPagar: new Date(),
                dataReceber: new Date(),
            };

            var currentDate = new Date();

            $scope.dateOptionsMes = {
                showOn: "button",
                buttonImageOnly: true,
                beforeShow:function(){

                    var dataFiltro = new Date($scope.anoAtual, $scope.mesAtual - 1, 1);
                    $scope.datasFiltro.dataPagar = dataFiltro;
                    $scope.datasFiltro.dataReceber = dataFiltro;

                    $scope.dateOptionsMes.showOnlyMonthPick = true;
                    $scope.$apply();
                },
                onClose:function(dateText, inst) {
                    eval('$scope.' + inst.input.attr('ng-model') + '= new Date(inst.selectedYear, inst.selectedMonth, 1);');

                    $scope.mesAtual = inst.selectedMonth + 1;
                    $scope.anoAtual = inst.selectedYear;

                    $scope.dateOptionsMes.showOnlyMonthPick = false;
                    $scope.atualizarContaFn();
                },
                showOtherMonths: true,
                changeYear: true,
                changeMonth: true,
                showButtonPanel: true,
                showOnlyMonthPick: false,
                maxDate: '01/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()
            };

            $scope.dateOptionsPagar = angular.copy($scope.dateOptionsMes);
            $scope.dateOptionsPagar.buttonImage = 'assets/img/calendario-contas-pagar.png';

            $scope.dateOptionsReceber = angular.copy($scope.dateOptionsMes);
            $scope.dateOptionsReceber.buttonImage = 'assets/img/calendario-contas-receber.png';


            // Aumenta e Diminui a altura da Aba de Seleção de Centro de Custos
	    /*$("#selCentroCustos").mouseenter(function(event){
		$(this).animate({paddingTop:'70px'},'fast')
  	    });

	    $("#selCentroCustos").click(function(event){
		$(this).css({paddingTop:'70px'})
            });

	    $("#selCentroCustos").mouseleave(function(event){
		$("#selCentroCustos").delay(6000);
		$(this).animate({paddingTop:'40px'},'fast')
        });*/
			
     }]);
});

