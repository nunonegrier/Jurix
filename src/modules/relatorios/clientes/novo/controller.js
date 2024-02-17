define(['../../module', 'jquery'], function (module, $) {
    'use strict';


    function setColunasSelecionadasParaFiltro($scope){
        $scope.filtroCliente.colunas = [];
        $.each( $scope.colunas, function( key, coluna ) {
            if(coluna.selecionado){
                $scope.filtroCliente.colunas.push(coluna);
            }
        });
    }

    function gerarRelatorioFn($scope, $state) {

        $scope.$on('FILTRO_RELATORIO_SALVO', function(ev, filtroSalvo){
            $state.go('layout.relatorioClienteResultado', {idFiltro: filtroSalvo.id});
        });

        return function (salvarRelatorio) {

            $scope.message = {};
            setColunasSelecionadasParaFiltro($scope);

            if($scope.filtroCliente.colunas.length === 0){
                $scope.message = {error:true, errorMessage: 'Pelo menos uma coluna deve ser marcada!'};
                return;
            }

            if(salvarRelatorio){
                $scope.$root.$broadcast('NOVO_FILTRO_RELATORIO', 'RELATORIO_CLIENTE', $scope.filtroCliente);
            }else{
                $state.go('layout.relatorioClienteResultado', {filtroCliente: $scope.filtroCliente})
            }
        };
    }

    function setAcoesColunas($scope) {
        $scope.colunas = {
            nome: {
                nome: 'Cliente',
                campo: 'nome',
                selecionado:false
            },
            nomeSolteiro: {
                nome: 'Nome de solteiro',
                campo: 'clienteFisico.nomeSolteiro',
                selecionado:false
            },
            rgRne: {
                nome: 'RG / RNE',
                campo: 'clienteFisico.rgRne',
                selecionado:false
            },
            sexo: {
                nome: 'Sexo',
                campo: 'clienteFisico.sexo',
                selecionado:false,
                filter: 'jurixEnumFilter:EnumSexo'
            },
            razaoSocial: {
                nome: 'Razão Social',
                campo: 'nome',
                selecionado:false
            },
            nomeFantasia: {
                nome: 'Nome Fantasia',
                campo: 'clienteJuridico.nomeFantasia',
                selecionado:false
            },
            cnpj: {
                nome: 'CNPJ',
                campo: 'clienteJuridico.cnpj',
                selecionado:false
            },
            inscricaoEstadual: {
                nome: 'Inscrição Estatual',
                campo: 'clienteJuridico.inscricaoEstadual',
                selecionado:false
            },
            inscricaoMunicipal: {
                nome: 'Inscrição Municipal',
                campo: 'clienteJuridico.inscricaoMunicipal',
                selecionado:false
            },
            nomeResponsavel: {
                nome: 'Nome do Responsável',
                campo: 'clienteJuridico.nomeResponsavel',
                selecionado:false
            },
            telefoneResponsavel: {
                nome: 'Telefone do Responsável',
                campo: 'telefone',
                selecionado:false
            },
            emailResponsavel: {
                nome: 'E-mail do Responsável',
                campo: 'email',
                selecionado:false
            },
            nomeResposavelAlternativo: {
                nome: 'Nome do Contato Alternativo',
                campo: 'clienteJuridico.nomeResposavelAlternativo',
                selecionado:false
            },
            telefoneResponsavelAlternativo: {
                nome: 'Telefone do Contato Alternativo',
                campo: 'clienteJuridico.telefoneResponsavelAlternativo',
                selecionado:false
            },
            emailResponsavelAlternativo: {
                nome: 'E-mail do Contato Alternativo',
                campo: 'clienteJuridico.emailResponsavelAlternativo',
                selecionado:false
            },
            dataNascimento: {
                nome: 'Data de Nascimento',
                campo: 'clienteFisico.dataNascimento',
                selecionado:false,
                filter: 'date:dd/MM/yyyy'
            },
            nacionalidade: {
                nome: 'Nacionalidade',
                campo: 'clienteFisico.nacionalidade',
                selecionado:false
            },
            nomePai: {
                nome: 'Nome do Pai',
                campo: 'clienteFisico.nomePai',
                selecionado:false
            },
            nomeMae: {
                nome: 'Nome da mãe',
                campo: 'clienteFisico.nomeMae',
                selecionado:false
            },
            cpf: {
                nome: 'CPF',
                campo: 'clienteFisico.cpf',
                selecionado:false
            },
            carteiraTrabalho: {
                nome: 'Carteira de Trabalho',
                campo: 'clienteFisico.carteiraTrabalho',
                selecionado:false
            },
            serie: {
                nome: 'Série',
                campo: 'clienteFisico.serie',
                selecionado:false
            },
            pis: {
                nome: 'PIS',
                campo: 'clienteFisico.pis',
                selecionado:false
            },
            profissao: {
                nome: 'Profissão/Ocupação',
                campo: 'clienteFisico.profissao',
                selecionado:false
            },
            tituloEleitor: {
                nome: 'Título de eleitor',
                campo: 'clienteFisico.tituloEleitor',
                selecionado:false
            },
            zona: {
                nome: 'Zona',
                campo: 'clienteFisico.zona',
                selecionado:false
            },
            secao: {
                nome: 'Seção',
                campo: 'clienteFisico.secao',
                selecionado:false
            },
            estadoCivil: {
                nome: 'Estado Civil',
                campo: 'clienteFisico.estadoCivil',
                selecionado:false
            },
            tipoEstadoCivil: {
                nome: 'Tipo Estado Civil',
                campo: 'clienteFisico.tipoEstadoCivil',
                selecionado:false
            },
            nomeConjugue: {
                nome: 'Nome do conjuge',
                campo: 'clienteFisico.nomeConjugue',
                selecionado:false
            },
            rgRneConjugue: {
                nome: 'R.G/R.N.E do Conjuge',
                campo: 'clienteFisico.rgRneConjugue',
                selecionado:false
            },
            cpfConjugue: {
                nome: 'CPF do Conjuge',
                campo: 'clienteFisico.cpfConjugue',
                selecionado:false
            },
            telefoneFisico1: {
                nome: 'Telefone 01',
                campo: 'telefone',
                selecionado:false
            },
            telefoneFisico2: {
                nome: 'Telefone 02',
                campo: 'clienteFisico.telefone2',
                selecionado:false
            },
            endereco: {
                nome: 'Endereço',
                campo: 'endereco',
                selecionado:false
            },
            municipio: {
                nome: 'Cidade',
                campo: 'municipio.nome',
                selecionado:false
            },
            estado: {
                nome: 'Estado',
                campo: 'municipio.estado.nome',
                selecionado:false
            },
            cep: {
                nome: 'CEP',
                campo: 'cep',
                selecionado:false
            },
            emailProfissional: {
                nome: 'Email Profissional',
                campo: 'clienteFisico.emailProfissional',
                selecionado:false
            },
            emailPessoal: {
                nome: 'EmailPessoal',
                campo: 'email',
                selecionado:false
            },
            indicadoPor: {
                nome: 'Indicado Por',
                campo: 'indicacao',
                selecionado:false
            },
            grupo:{
                nome: 'Grupo',
                campo: 'grupo.nome',
                selecionado:false
            }
        };
    }

    function setDateOptions($scope) {

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
    }

    function selecionarEstadoFn($scope, LocalidadeService) {
        return function () {

            LocalidadeService.buscarMunicipios($scope.filtroCliente.estado)
                .then(function (municipios) {
                    $scope.municipios = municipios;
                });
        };
    }

    module.controller('novoRelatorioClienteControler', ['$scope', '$state', 'jurixConstants', 'estados', 'grupos', 'LocalidadeService',
        function ($scope, $state, jurixConstants, estados, grupos, LocalidadeService) {

            $scope.filtroCliente = {
                nome: null,
                nomeSolteiro: null,
                rgRne: null,
                sexo: null,
                nomeFantasia: null,
                cnpj: null,
                inscricaoEstadual: null,
                inscricaoMunicipal: null,
                nomeResponsavel: null,
                telefoneResponsavel: null,
                emailResponsavel: null,
                nomeResposavelAlternativo: null,
                telefoneResponsavelAlternativo: null,
                emailResponsavelAlternativo: null,
                dataNascimento: null,
                nacionalidade: null,
                nomePai: null,
                nomeMae: null,
                cpf: null,
                carteiraTrabalho: null,
                pis: null,
                profissao: null,
                serie: null,
                tituloEleitor: null,
                zona: null,
                secao: null,
                estadoCivil: null,
                tipoEstadoCivil: null,
                nomeConjugue: null,
                rgRneConjugue: null,
                cpfConjugue: null,
                telefoneFisico1: null,
                telefoneFisico2: null,
                municipio: null,
                estado: null,
                cep: null,
                emailProfissional: null,
                emailPessoal: null,
                indicadoPor: null,
                colunas: [],
                grupo:null
            };
            $scope.message = {};


            setAcoesColunas($scope);
            setDateOptions($scope);

            $scope.estadosCivil = jurixConstants.ENUM.EnumEstadoCivil;
            $scope.tiposEstadoCivil = jurixConstants.ENUM.EnumTipoEstadoCivil;

            $scope.estados = estados;
            $scope.grupos = grupos;

            $scope.gerarRelatorio = gerarRelatorioFn($scope, $state);
            $scope.selecionarEstado = selecionarEstadoFn($scope, LocalidadeService);

        }]);
});

