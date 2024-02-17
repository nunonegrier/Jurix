define(['./module'], function (app) {

    return app.directive('jurixPermissoes', ['SegurancaService', function (SegurancaService) {

        return {

            restrict: 'A',

            link: function (scope, element, attrs) {

                if (!SegurancaService.possuiPermissao(attrs.jurixPermissoes)) {
                    $(element).remove();
                }
            }

        };
    }]);

});