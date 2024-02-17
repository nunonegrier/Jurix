define(['./module', 'text!./view.html'], function (module, view) {
    'use strict';

    function removerArquivoList(ctrl, idFileMetadata) {

        var indexFile = ctrl.filesCliente.map(function (x) {
            return x.id;
        }).indexOf(idFileMetadata);

        ctrl.filesCliente.splice(indexFile, 1);
    }

    function initComponent(ctrl) {

        ctrl.filesCliente = [];

        ctrl.arquivoData = {
            file: null,
            description: null,
            repository: ctrl.repository,
            formId: ctrl.formId
        };
    }


    module.component('jurixArquivos', {
        template: view,
        bindings: {
            repository: '<',
            formId: '=',
            isVisualizacao:'='
        },
        controller: ['$rootScope', '$q', 'FileService', function ($rootScope, $q, FileService) {

            var ctrl = this;

            $rootScope.$on('SALVAR_ARQUIVOS_TEMPORARIOS', function (ev, destFolder) {

                var filesToSave = ctrl.filesCliente.filter(function (fileCliente) {
                    return fileCliente.state === 'TEMPORARY';
                });

                var prom = [];

                filesToSave.forEach(function (fileToSave) {
                    fileToSave.destFolder = destFolder;
                    prom.push(FileService.setDefinitive(fileToSave));
                });

                $q.all(prom)
                    .then(function(){
                        $rootScope.$broadcast('ARQUIVOS_TEMPORARIOS_SALVOS');
                    });
            });

            ctrl.$onChanges = function(){

                if (!ctrl.arquivoData || ctrl.arquivoData.repository !== ctrl.repository) {

                    initComponent(ctrl);

                    ctrl.arquivoData.repository = ctrl.repository;

                    FileService.listFiles(ctrl.repository)
                        .then(function (folder) {

                            if (folder) {
                                ctrl.filesCliente = folder.childrens;
                            } else {
                                ctrl.filesCliente = [];
                            }
                        });
                }
            };

            FileService.addFunctionsToEscope(ctrl);

            ctrl.uploadFileCliente = function (element) {

                var files = angular.element(element)[0].files;
                for (var i = 0; i < files.length; i++) {

                    var file = files[i];

                    FileService.sendFileTemp(file, ctrl.arquivoData.repository, ctrl.arquivoData.description)
                        .then(function (fileTemp) {

                            fileTemp.data.description = fileTemp.data.name;
                            ctrl.filesCliente.push(fileTemp.data);
                        });
                }

            };

            ctrl.setArquivoARemover = function (idFileMetadata) {
                angular.element('#apagarArquivoModal').modal('show');
                ctrl.idFileMetadata = idFileMetadata;
            };

            ctrl.removerArquivo = function () {

                FileService.setFileRemoved(ctrl.idFileMetadata)
                    .then(function () {

                        angular.element('#apagarArquivoModal').modal('hide');

                        removerArquivoList(ctrl, ctrl.idFileMetadata);
                    });

            };
        }]
    });
});