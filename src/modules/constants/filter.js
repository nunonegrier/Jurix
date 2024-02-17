
define(['./module'], function (module) {

    function isIdValido(label) {
        return label !== 'null';
    }

    function getValorConstante(jurixConstants, nomeConstante, id) {

        var valor = id;
        jurixConstants['ENUM'][nomeConstante].forEach(function (i) {
            if (id === i.id) {
                valor = i.nome;
            }
        });

        return valor;
    }

    module.filter('jurixEnumFilter', ['jurixConstants', function (jurixConstants) {

        return function (id, nomeConstante) {

            if (!isIdValido(id))
                return '';

            return getValorConstante(jurixConstants, nomeConstante, id);
        };
    }]);
});