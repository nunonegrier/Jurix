define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';


    function initPagarConta(ctrl, contaReceber) {

        ctrl.contaPagar = contaReceber;
        ctrl.dataPagamento = new Date();
        ctrl.valorPago = 0;
        ctrl.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

        if (contaReceber.isAtrasado) {
            ctrl.idModalAtual = '#receitaPagaAtraso';
            ctrl.idForm = '#formPagamentoReceitaAtraso';
        } else {
            ctrl.idModalAtual = '#receitaPaga';
            ctrl.idForm = '#formPagamentoReceita';
        }

        angular.element(ctrl.idModalAtual).modal('show');
    }

    function pagamentoAtrasadoValido(ctrl) {
        angular.element('#despesaDataPagamentoAtrasoJuros').removeClass('is-invalid');
        if (ctrl.contaPagar.isAtrasado && (!ctrl.valorPago || (ctrl.contaPagar.valorReceber > ctrl.valorPago))) {
            angular.element('#despesaDataPagamentoAtrasoJuros').addClass('is-invalid');
            return false;
        }
        return true;
    }

    function setCamposConfirmarPagamento(ctrl) {
        ctrl.contaPagar.dataRecebimento = ctrl.dataPagamento;
        ctrl.contaPagar.valorRecebido = ctrl.valorPago;
    }

    function pagarContaFn(ctrl, $rootScope, contasReceberService) {
        return function () {

            var form = angular.element(ctrl.idForm)[0];

            angular.element(ctrl.idForm).find('.is-invalid').removeClass('is-invalid');

            setCamposConfirmarPagamento(ctrl);

            if (form.checkValidity()) {

                if(!pagamentoAtrasadoValido(ctrl)){
                    return;
                }

                contasReceberService.pagarConta(ctrl.contaPagar)
                    .then(function(){
                        angular.element(ctrl.idModalAtual).modal('hide');
                        $rootScope.$broadcast('CONTA_SALVA');
                        $rootScope.$broadcast('SALVAR_ARQUIVOS_TEMPORARIOS', 'contaReceber/pagamento/' + ctrl.contaPagar.id);
                    });

            } else {
                angular.element(ctrl.idForm).find('.ng-invalid').addClass('is-invalid');
            }
        };
    }

    module.component('contasReceberPagamento', {
        template: view,
        controller: ['$rootScope', 'contasReceberService', function ($rootScope, contasReceberService) {

            var ctrl = this;

            $rootScope.$on('PAGAMENTO_CONTA_RECEBER', function (ev, contaReceber) {
                initPagarConta(ctrl, contaReceber);
            });

            ctrl.pagarConta = pagarContaFn(ctrl, $rootScope, contasReceberService);
        }]
    });
});