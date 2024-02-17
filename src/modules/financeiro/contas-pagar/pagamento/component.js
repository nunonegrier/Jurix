define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';


    function initPagarConta(ctrl, contaPagar) {

        ctrl.contaPagar = contaPagar;
        ctrl.pagamentoFinal = false;
        ctrl.dataPagamento = new Date();
        ctrl.valorPago = 0;
        ctrl.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

        if (contaPagar.isAtrasado) {
            ctrl.idModalAtual = '#despesaPagaAtraso';
            ctrl.idForm = '#formPagamentoDespesaAtraso';
        } else {
            ctrl.idModalAtual = '#despesaPaga';
            ctrl.idForm = '#formPagamentoDespesa';
        }

        angular.element(ctrl.idModalAtual).modal('show');
    }

    function pagamentoAtrasadoValido(ctrl) {
        angular.element('#despesaDataPagamentoAtrasoJuros').removeClass('is-invalid');
        if (ctrl.contaPagar.isAtrasado && (!ctrl.valorPago || (ctrl.contaPagar.valor > ctrl.valorPago))) {
            angular.element('#despesaDataPagamentoAtrasoJuros').addClass('is-invalid');
            return false;
        }
        return true;
    }

    function setCamposConfirmarPagamento(ctrl) {
        ctrl.contaPagar.dataPagamento = ctrl.dataPagamento;
        ctrl.contaPagar.valorPago = ctrl.valorPago;
        ctrl.contaPagar.pagamentoFinal = ctrl.pagamentoFinal;
    }

    function pagarContaFn(ctrl, $rootScope, contasPagarService) {
        return function () {

            var form = angular.element(ctrl.idForm)[0];

            angular.element(ctrl.idForm).find('.is-invalid').removeClass('is-invalid');

            setCamposConfirmarPagamento(ctrl);

            if (form.checkValidity()) {

                if(!pagamentoAtrasadoValido(ctrl)){
                    return;
                }

                contasPagarService.pagarConta(ctrl.contaPagar)
                    .then(function(){
                        angular.element(ctrl.idModalAtual).modal('hide');
                        $rootScope.$broadcast('CONTA_SALVA');
                        $rootScope.$broadcast('SALVAR_ARQUIVOS_TEMPORARIOS', 'contaPagar/pagamento/' + ctrl.contaPagar.id);
                    });

            } else {
                angular.element(ctrl.idForm).find('.ng-invalid').addClass('is-invalid');
            }
        };
    }

    module.component('contasPagarPagamento', {
        template: view,
        controller: ['$rootScope', 'contasPagarService', function ($rootScope, contasPagarService) {

            var ctrl = this;

            $rootScope.$on('PAGAMENTO_CONTA_PAGAR', function (ev, contaPagar) {
                initPagarConta(ctrl, contaPagar);
            });

            ctrl.pagarConta = pagarContaFn(ctrl, $rootScope, contasPagarService);
        }]
    });
});