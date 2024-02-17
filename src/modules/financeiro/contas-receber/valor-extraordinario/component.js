define(['../../module', 'text!./view.html'], function (module, view) {

    function initNovaConta(ctrl, contaReceber){

        ctrl.contaReceber = contaReceber;

        angular.element('#receitaExtraordinariaModal').modal('show');
    }

    module.component('valorExtraordinarioReceber', {
        template: view,
        controller: ['$rootScope', 'contasReceberService',
            function ($rootScope, contasReceberService) {

                var ctrl = this;


                $rootScope.$on('NOVO_VALOR_EXTRAORDINARIO_RECEBER', function(evt, contaReceber){
                    initNovaConta(ctrl, contaReceber);
                });


                ctrl.salvarValorExtraordinario = function(){

                    var form = angular.element('#valorExtraordinarioForm')[0];

                    angular.element('#valorExtraordinarioForm').find('.is-invalid').removeClass('is-invalid');

                    if (form.checkValidity()){

                        contasReceberService.save(ctrl.contaReceber)
                            .then(function(){

                                angular.element('#receitaExtraordinariaModal').modal('hide');
                                $rootScope.$broadcast('CONTA_SALVA');
                            })
                            .catch(function(){
                                alert('erro')
                            })

                    }else{
                        angular.element('#valorExtraordinarioForm').find('.ng-invalid').addClass('is-invalid');
                    }
                };
            }]
    });

});