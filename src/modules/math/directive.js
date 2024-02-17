define(['./module'], function (module) {

    function fixDecimalInput(value, element){
        var n = parseFloat(value);
        if (parseInt(n, 10) !== n && String(n).split('.')[1].length != 2) {
            element.val(n.toFixed(2));
        }
    }

    module.directive('toPrecision', function(){
        return {
            replace: true,
            scope:false,
            require:'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                var e = angular.element(element);
                e.on('keyup', function(){
                    fixDecimalInput(e.val(), e);
                });

                scope.$watch(
                    function(){
                        return ngModel.$modelValue;
                    }, function(newValue){

                        if(newValue) {
                            fixDecimalInput(newValue, e);
                        }

                    }, true);
            }
        }
    });

    module.directive('currencyFormatter', ['$filter', function ($filter) {


        formatter = function (num) {
            var teste = $filter('currency')(num);
            teste = teste.replace('R$', '');
            return teste;
        };

        function parseNumber(strg) {
            var strg = strg || "";
            strg = strg.replace(/\./g, '');
            strg = strg.replace(',', '.');

            return parseFloat(strg);
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (str) {
                    return str ? parseNumber(str) : '';
                });
                ngModel.$formatters.push(formatter);

                element.bind('blur', function() {
                    element.val(formatter(ngModel.$modelValue))
                });
                element.bind('focus', function () {
                    element.val(ngModel.$modelValue);
                });
            }
        };
    }]);
});