define(['./module', 'jquery', 'angular'], function (module, $, angular) {

    function setPageObject(ctrl) {
        ctrl.pages = [];
        ctrl.pagesFinal = [];
        ctrl.hasInterval = false;

        ctrl.currentPage = ctrl.pageObject.number + 1;
        ctrl.currentPageSize = ctrl.pageObject.size;

        var totalPages = ctrl.pageObject.totalPages;

        var initPages = 0;

        if ((totalPages - ctrl.currentPage) > 3) {
            while (initPages < ctrl.currentPage) {
                initPages += 3;
            }

            initPages -= 2;
        } else {
            initPages = totalPages - 3;
        }

        var max = 2;

        if (totalPages > 6 && ((totalPages - ctrl.currentPage) > 3)) {
            for (var i = 0; i <= max; i++) {
                ctrl.pages.push(initPages + i);
            }

            if (totalPages > 6) {

                var initPagesFinal = totalPages - 2;

                for (var i = initPagesFinal; i <= totalPages; i++) {
                    ctrl.pagesFinal.push(i);
                }

                ctrl.hasInterval = true;
            }

        } else {

            if(totalPages > 6) {
                ctrl.hasInterval = true;

                for (var i = 0; initPages + i <= totalPages; i++) {
                    ctrl.pagesFinal.push(initPages + i);
                }
            }else{

                for (var i = 1; i <= totalPages; i++) {
                    ctrl.pagesFinal.push(i);
                }

            }
        }

    }


    module.controller('paginacaoController', [function () {

        var ctrl = this;

        ctrl.$onInit = function () {
            setPageObject(ctrl);
        };

        ctrl.irParaProximo = function () {
            ctrl.irPagina(ctrl.currentPage + 1);
        };

        ctrl.irParaAnterior = function () {
            ctrl.irPagina(ctrl.currentPage - 1);
        };

        ctrl.irParaUltimo = function () {
            ctrl.irPagina(ctrl.pageObject.totalPages);
        };

        ctrl.irParaPrimeiro = function () {
            ctrl.irPagina(1);
        };

        ctrl.irPagina = function (pag) {
            ctrl.currentPage = pag;

            ctrl.pageFilters.page = pag;
            ctrl.pageFilters.size = ctrl.currentPageSize;

            ctrl.updatePaginationFn();
        };

        ctrl.setPageSize = function () {
            ctrl.currentPage = 1;
            ctrl.pageFilters.page = 1;
            ctrl.pageFilters.size = ctrl.currentPageSize;

            ctrl.updatePaginationFn();
        };

        ctrl.$onChanges = function () {
            setPageObject(ctrl);
        };

    }]);

});

