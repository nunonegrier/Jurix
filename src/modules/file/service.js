define(['./module', 'angular'], function (module, angular) {
    'use strict';


    module.service('FileService', ['$http', '$q', function ($http, $q) {

        var that = this;

        that.listFiles = function (repository) {

            var defered = $q.defer();

            $http.get('arquivos/getMetadata?path=' + repository).then(function (result) {
                defered.resolve(result.data);
            }, function (err) {
                defered.reject(err);
            });

            return defered.promise;
        };

        that.sendFile = function (file, repository, description) {

            var fdata = new FormData();
            fdata.append('repository', repository);
            fdata.append('description', description);
            fdata.append('file', file);

            return $http.post('arquivos/uploadDefinitive', fdata, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });

        };

        that.sendFileTemp = function (file, repository, description) {

            var fdata = new FormData();
            fdata.append('repository', repository);
            fdata.append('description', description);
            fdata.append('file', file);

            return $http.post('arquivos/uploadTemp', fdata, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });

        };


        that.setDefinitive = function (fileMetadada) {

            var defered = $q.defer();

            $http.put('arquivos/setDefinitive/' + fileMetadada.id, fileMetadada)
                .then(function () {
                    fileMetadada.state = 'DEFINITIVE';
                    defered.resolve();
                }, function (err) {
                    defered.reject(err);
                });

            return defered.promise;

        };

        that.setFileRemoved = function (idFileMetadata){

            var defered = $q.defer();

            $http.put('arquivos/setRemoved/' + idFileMetadata)
                .then(function () {
                    defered.resolve();
                }, function (err) {
                    defered.reject(err);
                });

            return defered.promise;

        };


        //FIXME colocar ações em diretiva
        that.addFunctionsToEscope = function (scope) {

            scope.listFiles = function () {
                that.listFiles(scope.arquivoData.repository)
                    .then(function (repoFile) {
                        scope.filesToShow = repoFile.childrens;
                    });
            };

            scope.uploadFile = function () {

                var form = angular.element('#' + scope.arquivoData.formId)[0];

                if (form.checkValidity()) {

                    that.sendFile(scope.arquivoData.file[0], scope.arquivoData.repository, scope.arquivoData.description)
                        .then(function () {
                            scope.arquivoData.file = null;
                            scope.arquivoData.description = null;

                            scope.listFiles();
                        });

                } else {
                    form.classList.add('was-validated');
                }

            };

        };

    }]);
});

