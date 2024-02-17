define(['./module', 'text!./view.html'], function (module, view) {
    'use strict';

    function irParaTopo($window){
        $window.scrollTo(0, 0);
    }

    function alertMsgController($scope, $window, $element, $compile){

        var ctrl = this;

        var clone = $element.find('.row').children().clone()
        $element.append(clone);
        $compile(clone)($scope);
        $element.find('.row').hide();

        ctrl.$onInit = function() {
            if(!ctrl.message) {
                ctrl.message = {};
            }

            ctrl.message.successMessage = 'Salvo com sucesso!';

            if(ctrl.message.success){
                irParaTopo($window);
            }
        };

        ctrl.hideAlert = function() {
            ctrl.message = {};
        };

        $scope.$on('SALVO_SUCESSO', function(){
            ctrl.message = {success:true, successMessage: 'Salvo com sucesso!'};
            irParaTopo($window);
        });

        $scope.$on('ERRO_CAMPOS_OBRIGATORIOS', function(){
            ctrl.message = {error:true, errorMessage: 'Campos obrigatórios não preenchidos!'};
            irParaTopo($window);
        });

        $scope.$on('ERRO_MSG', function(errorMessage){
            ctrl.message = {error:true, errorMessage: errorMessage};
            irParaTopo($window);
        });

    }

    module.component('alertMsg', {
        template: view,
        controller: ['$scope', '$window', '$element', '$compile', alertMsgController],
        bindings:{
            message: '='
        }
    });
});