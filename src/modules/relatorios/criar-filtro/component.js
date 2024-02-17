define(['../module', 'text!./modal.html'], function (module, view) {
    'use strict';
    module.component('novoFiltroRelatorio', {
        template: view,
        controller: ['$rootScope', 'FiltroService', function ($rootScope, FiltroService) {

                var ctrl = this;

                $rootScope.$on('NOVO_FILTRO_RELATORIO', function (ev, tipoFiltro, valor) {

                    ctrl.novoFiltro = {
                        nome: null,
                        descricao: null,
                        valor: JSON.stringify(valor),
                        tipo: tipoFiltro
                    };

                    angular.element('#gravarGerarRelatorio').modal('show');
                });

                ctrl.salvarFiltro = function () {

                    var form = angular.element('#formFiltroRelatorio')[0];

                    angular.element('#formFiltroRelatorio').find('.is-invalid').removeClass('is-invalid');

                    if (form.checkValidity()) {

                        FiltroService.save(ctrl.novoFiltro)
                            .then(function (filtroSalvo) {
                                angular.element('#gravarGerarRelatorio').modal('hide');

                                setTimeout(function(){
                                    $rootScope.$broadcast('FILTRO_RELATORIO_SALVO', filtroSalvo);
                                }, 500);

                            });

                    } else {
                        angular.element('#formFiltroRelatorio').find('.ng-invalid').addClass('is-invalid');
                    }


                };
            }]
    });
});