define(['./module'], function (module) {
    'use strict';

    module.service('SegurancaService', ['loggedUser', function (loggedUser) {

        var that = this;

        that.possuiPermissao = function(permissoes_){

            var permissoes = permissoes_.split(',');
            var temAcesso = false;

            permissoes.forEach(function (permissao) {
                if (loggedUser.permissoes.indexOf(permissao) !== -1) {
                    temAcesso = true;
                    return;
                }
            });

            return temAcesso;
        };

    }]);
});

