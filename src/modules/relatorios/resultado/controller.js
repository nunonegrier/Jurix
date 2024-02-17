define(['../module'], function (module) {
    'use strict';

    function addColunName($scope, colunaResultado){

        $scope.colunas.push(colunaResultado.nome.replace(new RegExp(' ', 'g'), '\n'));
    }

    function getAttributeValue($filter, colunaResultado, object){

        try {
            var attributeValue = eval('object.' + colunaResultado.campo);

            if (colunaResultado.filter) {
                var filterData = colunaResultado.filter.split(':');
                attributeValue = $filter(filterData[0])(attributeValue, filterData[1])
            }

            return attributeValue;
        }catch (e){
            return null;
        }
    }

    function getColumnValues($scope, $filter, colunasResultado, processoResultado){

        var columnValues = [];

        colunasResultado.forEach(function(colunaResultado){
            columnValues.push(getAttributeValue($filter, colunaResultado, processoResultado));
        });


        return columnValues;
    }

    module.controller('resultadoRelatorioProcessoControler', ['$scope', '$filter', '$state', 'processosResultado', 'colunasResultado', 'favoritos',
        function($scope, $filter, $state, processosResultado, colunasResultado, favoritos) {

        $scope.colunas = [];
        $scope.linhas = [];
        $scope.favoritos = favoritos;
        $scope.favoritoSelecionado = $state.params['idFiltro'] ? parseInt($state.params['idFiltro']) : null;

        colunasResultado.forEach(function(colunaResultado){
            addColunName($scope, colunaResultado);
        });

        processosResultado.forEach(function(processoResultado) {

            var linha = getColumnValues($scope, $filter, colunasResultado, processoResultado);
            $scope.linhas.push(linha);
        });

        $scope.printPDF = function(){

            var fontSize = 10;

            if($scope.colunas.length > 12){
                fontSize = 8;
            }

            if($scope.colunas.length > 16){
                fontSize = 6;
            }

            var doc = new jsPDF({ orientation: 'landscape'});
            var finalY = doc.previousAutoTable.finalY;
            doc.autoTable({
                head: [$scope.colunas],
                body: $scope.linhas,
                styles:{
                    cellWidth:'wrap',
                    fontSize:fontSize
                }

            });
            doc.save('table.pdf');
            //https://github.com/simonbengtsson/jsPDF-AutoTable
        };

        $scope.printExcel = function(){

            var wb = XLSX.utils.table_to_book(document.getElementById('jurix-result-table'));
            wb['Sheets']['Sheet1']['!cols'] = [];
            XLSX.writeFile(wb, "export.xlsx");
            //https://github.com/SheetJS/js-xlsx
        };

        $scope.selecionaFavorito = function(){
            if($scope.favoritoSelecionado) {
                $state.go('layout.relatorioProcessoResultado', {idFiltro: $scope.favoritoSelecionado});
            }
        };

    }]);
});

