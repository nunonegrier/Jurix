define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.component('contasPagarView', {
        template: view,
        controller: ['$rootScope', 'contasPagarService', function($rootScope, contasPagarService){

            var ctrl = this;

            $rootScope.$on('VISUALIZAR_CONTA_PAGAR', function(ev, contaPagar_){

                contasPagarService.findById(contaPagar_.id)
                    .then(function (contaPagar) {
                        ctrl.contaPagar = contaPagar;
                        ctrl.jurosMultas = ctrl.contaPagar.valorPago - ctrl.contaPagar.valor;
                        angular.element('#despesaVer').modal('show');
                    });
            });

            ctrl.editarConta = function(contaPagar){
                angular.element('#despesaVer').modal('hide');
                $rootScope.$broadcast('EDITAR_CONTA_PAGAR', contaPagar);
            };

        }]
    });
});