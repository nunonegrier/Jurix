define(['../../module', 'text!./view.html'], function (module, view) {
    'use strict';

    function visulizarContaReceberFn($scope){
        return function(contaReceber){
            $scope.$root.$broadcast('VISUALIZAR_CONTA_RECEBER', contaReceber);
        }
    }

    function pagamentoContaReceberFn($scope){
        return function(contaReceber){
            $scope.$root.$broadcast('PAGAMENTO_CONTA_RECEBER', contaReceber);
        }
    }

    module.component('contasReceberSituacao', {
        template: view,
        bindings: {
            contaReceber: '='
        },
        controller: ['$rootScope', function($rootScope){

            var ctrl = this;

            ctrl.getClassPendente = function(){
              return ctrl.contaReceber.avencer ? 'btn-pagamentoAmarelo' : 'btn-pagamentoCinza' ;
            };

            ctrl.visulizarContaReceber = visulizarContaReceberFn($rootScope);

            ctrl.pagamentoContaReceber = pagamentoContaReceberFn($rootScope);
        }]
    });
});