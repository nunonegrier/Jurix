define(['../module', 'text!./view.html', 'angular'], function (module, view, angular) {
        'use strict';


        function getNovoAndamentoProcesso($scope, processo, SegurancaService) {
            var novoAndamentoProcesso = {
                data: new Date(),
                processo: processo,
                tipoAndamento: {},
                descricao: null,
                criaEventoPauta: SegurancaService.possuiPermissao('Pauta.Criar'),
                pautaEvento: {
                    processo: processo
                }
            };

            if (!$scope.podeCriarEventoColaboradores) {
                novoAndamentoProcesso.pautaEvento.colaborador = {id: $scope.colaboradorUsuarioAtual.id};
            }

            return novoAndamentoProcesso;
        }

        function setProcessoId(andamentoProcesso) {
            andamentoProcesso.processoId = andamentoProcesso.processo.id;
        }

        function abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope) {

            $scope.visualizacao = visualizacao;

            $scope.andamentoProcesso = andamentoProcesso;

            if (andamentoProcesso.id) {
                setRepositoryToAndamento(andamentoProcesso, $scope);
            } else {
                setDefautRepository($scope);
            }

            setProcessoId(andamentoProcesso);

            angular.element('#processoNovoAndamento').modal("show");
        }

        function novoAndamentoProcesso($scope, SegurancaService, processo){

            $scope.exibirArquivos = true;
            var visualizacao = false;
            angular.element('#processoEventoForm')[0].reset();
            angular.element('#formAndamentoPautaEvento')[0].reset();

            angular.element('#processoEventoForm').removeClass('was-validated');
            angular.element('#formAndamentoPautaEvento').removeClass('was-validated');

            abrirModalAndamentoProcesso(getNovoAndamentoProcesso($scope, processo, SegurancaService), visualizacao, $scope);
        }

        function addHandlers($scope, SegurancaService) {

            $scope.$on('NOVO_ANDAMENTO_PROCESSO', function (ev, processo) {
                novoAndamentoProcesso($scope, SegurancaService, processo);
            });

            $scope.$on('VISUALIZAR_ANDAMENTO_PROCESSO', function (ev, andamentoProcesso) {

                var visualizacao = true;
                abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope);
            });

            $scope.$on('EDITAR_ANDAMENTO_PROCESSO', function (ev, andamentoProcesso) {
                var visualizacao = false;
                abrirModalAndamentoProcesso(andamentoProcesso, visualizacao, $scope);
            });

            $scope.$on('ARQUIVOS_TEMPORARIOS_SALVOS', function(){
                $scope.exibirArquivos = false;

                setTimeout(function(){
                    $scope.exibirArquivos = true;
                    $scope.$apply();
                }, 500);

            })
        }

        function carregarTiposAndamento($scope, TipoAndamentoService) {

            TipoAndamentoService.findByFinalidade('ANDAMENTO')
                .then(function (tiposAndamento) {
                    $scope.tiposAndamento = tiposAndamento._embedded.tipoAndamento;
                });
        }

        function setRepositoryToAndamento(andamentoProcesso, $scope) {
            $scope.filesRespository = getFolderPath(andamentoProcesso);
        }

        function getFolderPath(andamentoProcessoSalvo) {
            return 'processo/' + andamentoProcessoSalvo.processo.id + '/andamentoProcesso/' + andamentoProcessoSalvo.id;
        }

        function isFormsValidos($scope, formAdamento, formAndamentoPautaEvento) {
            if ($scope.andamentoProcesso.criaEventoPauta) {
                var isFormAdamentoValid = formAdamento.checkValidity();
                var isFormAndamentoPautaEventoValid = formAndamentoPautaEvento.checkValidity();

                return isFormAdamentoValid && isFormAndamentoPautaEventoValid;
            } else {
                return formAdamento.checkValidity()
            }
        }

        function addClassValidatedForms($scope, formAdamento, formAndamentoPautaEvento) {
            if ($scope.andamentoProcesso.criaEventoPauta) {
                formAdamento.classList.add('was-validated');
                formAndamentoPautaEvento.classList.add('was-validated');
            } else {
                formAdamento.classList.add('was-validated');
            }
        }

        function salvarAgendamentoFn($scope, AndamentoService, SegurancaService) {
            return function (salvarECriarOutro) {

                var formAdamento = angular.element('#processoEventoForm')[0];
                var formAndamentoPautaEvento = angular.element('#formAndamentoPautaEvento')[0];

                angular.element('#processoEventoForm').find('.is-invalid').removeClass('is-invalid');
                angular.element('#formAndamentoPautaEvento').find('.is-invalid').removeClass('is-invalid');

                if (isFormsValidos($scope, formAdamento, formAndamentoPautaEvento)) {

                    AndamentoService.save($scope.andamentoProcesso)
                        .then(function (andamentoProcessoSalvo) {

                            $scope.andamentoProcesso = andamentoProcessoSalvo;

                            atualizarArquivosTemporarios($scope, andamentoProcessoSalvo);

                            if (salvarECriarOutro) {
                                novoAndamentoProcesso($scope, SegurancaService, $scope.andamentoProcesso.processo);
                            } else {
                                angular.element('#processoNovoAndamento').modal("hide");
                            }

                            $scope.$root.$broadcast('SALVAR_ANDAMENTO');
                        });1
                } else {
                    angular.element('#processoEventoForm').find('.ng-invalid').addClass('is-invalid');
                    angular.element('#formAndamentoPautaEvento').find('.ng-invalid').addClass('is-invalid');
                }

                addClassValidatedForms($scope, formAdamento, formAndamentoPautaEvento)
            };
        }

        function atualizarArquivosTemporarios($scope, andamentoProcessoSalvo) {
            $scope.$root.$broadcast('SALVAR_ARQUIVOS_TEMPORARIOS', getFolderPath(andamentoProcessoSalvo));
        }

        function setDefautRepository($scope) {
            $scope.filesRespository = 'andamentoProcesso/novo';
        }

        function carregarColaboradores($scope, colaboradorService) {
            colaboradorService.findAll()
                .then(function (colaboradoresPage) {
                    $scope.colaboradores = colaboradoresPage.content;

                    $scope.colaboradores.forEach(function (col) {
                        if (col.usuario.id === $scope.$root.usuarioAtual.id) {
                            $scope.colaboradorUsuarioAtual = col;
                        }
                    })

                });
        }

        function novoTipoAndamentoFn($scope) {
            return function () {
                $scope.tipoAndamento = {};
                angular.element('#adicionarTipoAndamento').modal("show");
            };
        }

        function salvarTipoAndamentoFn($scope, TipoAndamentoService) {
            return function () {

                var form = angular.element('#salvarTipoAndamento')[0];

                if (form.checkValidity()) {

                    TipoAndamentoService.save($scope.tipoAndamento)
                        .then(function (tipoAndamentoSalvo) {
                            $scope.tiposAndamento.push(tipoAndamentoSalvo);
                            $scope.andamentoProcesso.tipoAndamento = tipoAndamentoSalvo;
                            angular.element('#adicionarTipoAndamento').modal("hide");
                        });
                }
            };
        }

        function irPautaEventoFn($scope, $state) {

            angular.element('#processoNovoAndamento').on('hidden.bs.modal', function () {
                if ($scope.irPautaEventoClick) {
                    $state.go('layout.pautaEvento', {idEdit: $scope.andamentoProcesso.pautaEvento.id});
                }
            });

            return function () {
                $scope.irPautaEventoClick = true;
                angular.element('#processoNovoAndamento').modal("hide");
            }
        }

        module.directive('andamentoProcessoForm', ['AndamentoService', 'TipoAndamentoService', 'colaboradorService', 'SegurancaService',
            function (AndamentoService, TipoAndamentoService, colaboradorService, SegurancaService) {

                return {
                    restrict: 'E',
                    template: view,
                    scope: {},
                    controller: ['$scope', '$state', function ($scope, $state) {

                        $scope.podeCriarEventoColaboradores = SegurancaService.possuiPermissao('Pauta.Criar.ParaColaboradores');

                        addHandlers($scope, SegurancaService);

                        carregarTiposAndamento($scope, TipoAndamentoService);
                        setDefautRepository($scope);

                        carregarColaboradores($scope, colaboradorService);

                        $scope.salvarAndamento = salvarAgendamentoFn($scope, AndamentoService, SegurancaService);

                        $scope.novoTipoAndamento = novoTipoAndamentoFn($scope);

                        $scope.salvarTipoAndamento = salvarTipoAndamentoFn($scope, TipoAndamentoService);

                        $scope.irPautaEvento = irPautaEventoFn($scope, $state);

                        $scope.possuiPermissaoCriarPauta = SegurancaService.possuiPermissao('Pauta.Criar');

                    }]
                };
            }]);
    }
);