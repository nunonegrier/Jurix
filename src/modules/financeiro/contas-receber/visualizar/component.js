define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';

    module.component('contasReceberView', {
        template: view,
        controller: ['$rootScope', '$state', function($rootScope, $state){

            var ctrl = this;

            $rootScope.$on('VISUALIZAR_CONTA_RECEBER', function(ev, contaReceber){
                ctrl.contaReceber = contaReceber;
                ctrl.pagamentoParcelado = contaReceber.pagamentoParcelado ? 'S' : 'N';
                ctrl.jurosMultas = contaReceber.valorRecebido ? contaReceber.valorRecebido - contaReceber.valorReceber : 0;

                if(ctrl.contaReceber.contrato) {
                    angular.element('#alterarContrato').modal('show');
                }else{
                    angular.element('#ContaReceberVer').modal('show');
                }
            });

            ctrl.editarConta = function(contaReceber){
                angular.element('#ContaReceberVer').modal('hide');
                setTimeout(function(){
                    $rootScope.$broadcast('EDITAR_CONTA_RECEBER', contaReceber);
                }, 500);

            };

            ctrl.irParaContrato = function(){

                angular.element('#alterarContrato').modal('hide');
                setTimeout(function () {
                    $state.go('layout.clienteContratoEditar', {clienteId: ctrl.contaReceber.cliente.id,id: ctrl.contaReceber.contrato.id});
                }, 500);
            };

        }]
    });
});