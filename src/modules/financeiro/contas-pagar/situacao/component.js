define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';

    function visulizarContaPagarFn($scope){
        return function(contasPagar){
            $scope.$root.$broadcast('VISUALIZAR_CONTA_PAGAR', contasPagar);
        }
    }

    function pagamentoContaPagarFn($scope){
        return function(contasPagar){
            $scope.$root.$broadcast('PAGAMENTO_CONTA_PAGAR', contasPagar);
        }
    }

    module.component('contasPagarSituacao', {
        template: view,
        bindings: {
            contasPagar: '='
        },
        controller: ['$rootScope', function($rootScope){

            var ctrl = this;

            ctrl.getClassPendente = function(){
              return ctrl.contasPagar.avencer ? 'btn-pagamentoAmarelo' : 'btn-pagamentoCinza' ;
            };

            ctrl.visulizarContaPagar = visulizarContaPagarFn($rootScope);

            ctrl.pagamentoContaPagar = pagamentoContaPagarFn($rootScope);
        }]
    });
});