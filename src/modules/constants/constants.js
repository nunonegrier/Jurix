define(['./module'], function (module) {
    'use strict';

    module.constant('jurixConstants', {
        ENUM: {
            EnumTipoFundacao: [
                {id: 'PUBLICA', nome: 'Pública'},
                {id: 'PRIVADA', nome: 'Privada'},
                {id: 'PARAESTATAL', nome: 'Paraestatal'},
                {id: 'DIREITO_PUBLIO_EXTERNO', nome: 'Direito Público Externo'}
            ],

            EnumSexo: [
                {id: 'MASCULINO', nome: 'Masculino'},
                {id: 'FEMININO', nome: 'Feminino'}
            ],

            EnumEstadoCivil: [
                {id: 'SOLTEIRO', nome: 'Solteiro(a)'},
                {id: 'CASADO', nome: 'Casado(a)'},
                {id: 'DIVORCIADO', nome: 'Divorciado(a)'},
                {id: 'VIUVO', nome: 'Viúvo(a)'}
            ],

            EnumTipoEstadoCivil: [
                {id: 'NAO_APLICAVEL', nome: 'Não Aplicável'},
                {id: 'COMUNHAO_UNIVERSAL_BENS', nome: 'Comunhão Universal de Bens'},
                {id: 'COMUNHAO_PARCIAL_BENS', nome: 'Comunhão Parcila de Bens'},
                {id: 'SEPARACAO_TOTAL_BENS', nome: 'Separação Total de Bens'},
                {id: 'PARTICIPACAO_FINAL_AQUESTOS', nome: 'Participação Final nos Aquestos'}
            ],
            EnumIndexadorContrato: [
                {id: 'SALARIO_MINIMO', nome: 'Sal.Mínimo'},
                {id: 'REAL', nome: 'Real (R$)'}
            ],
            EnumTipoContrato: [
                {id: 'SIMPLES', nome: 'Simples'},
                {id: 'MENSAL', nome: 'Mensal'},
                {id: 'SEMESTRAL', nome: 'Semestral'},
                {id: 'ANUAL', nome: 'Anual'}
            ],
            EnumTipoProcesso: [
                {id: 'ADMINISTRATIVO', nome: 'Administrativo'},
                {id: 'EXTRAJUDICIAL', nome: 'Extrajudicial'},
                {id: 'JUDICIAL', nome: 'Judicial'}
            ],
            EnumAreaProcesso: [
                {id: 'CIVEL', nome: 'Cível'},
                {id: 'FAMILIA_SUCESSOES', nome: 'Família e Sucessões'},
                {id: 'TRABALHISTA', nome: 'Trabalhista'},
                {id: 'CRIMINAL', nome: 'Criminal'},
                {id: 'AMBIENTAL', nome: 'Ambiental'},
                {id: 'ELEITORAL', nome: 'Eleitoral'},
                {id: 'TRIBUTARIO', nome: 'Tributário'},
                {id: 'PREVIDENCIARIO', nome: 'Previdenciário'},
                {id: 'MILITAR', nome: 'Militar'},
                {id: 'ADMINISTRATIVO', nome: 'Administrativo'}
            ],
            EnumInstanciaProcesso : [
                {id: 'PRIMEIRA_INSTANCIA', nome: '1ª Instância'},
                {id: 'SEGUNDA_INSTANCIA', nome: '2ª Instância'},
                {id: 'SUPERIOR', nome: 'Superior'}
            ],
            PossiveisEstadosEvento: [
                {
                    id: 'PENDENTE_INICIO',
                    divClass: 'col-lg-2 eventosCol3criador',
                    textoClass: 'eventosEstado',
                    textoClassLista: 'eventosEstadoLista',
                    botaoClass: 'btn btn-consultarEvento btn-lg btn-block',
                    botaoListClass:'btn btn-consultarEvento btn-sm btn-block',
                    botaoProrrogacaoClass: 'btn-consultarEvento',
                    textoBotao: 'Alterar',
                    colorList: 'color:#3671AF'
                }, {
                    id: 'PENDENTE_FIM',
                    divClass: 'col-lg-2 eventosCol3urgente',
                    textoClass: 'eventosEstado',
                    textoClassLista: 'eventosEstadoLista',
                    botaoClass: 'btn btn-gravarEvento btn-lg btn-block',
                    botaoListClass:'btn btn-gravarEvento btn-sm btn-block',
                    botaoProrrogacaoClass: 'btn-gravarEvento',
                    textoBotao: 'Finalizar',
                    colorList: 'color: #CB2D59;'
                }, {
                    id: 'FINALIZADO',
                    divClass: 'col-lg-2 eventosCol3medioFin',
                    textoClass: 'eventosEstadoFinalizado',
                    textoClassLista: 'eventosEstadoFinalizadoLista',
                    botaoClass: 'btn btn-finalizarEvento btn-lg',
                    botaoListClass:'btn btn-finalizarEvento btn-sm btn-block',
                    botaoProrrogacaoClass: 'btn-finalizarEvento',
                    textoBotao: 'Ver',
                    colorList: 'color: #CB2D59;'
                }, {
                    id: 'FALHOU',
                    divClass: 'col-lg-2 eventosCol3Falha',
                    textoClass: 'eventosEstadoFalha',
                    textoClassLista: 'eventosEstadoFalhaLista',
                    botaoClass: 'btn btn-falhaEvento btn-lg btn-block',
                    botaoListClass: 'btn btn-falhaEvento btn-sm btn-block',
                    botaoProrrogacaoClass: 'btn-falhaNovaDataEvento',
                    botaoProrrogacaoClassList: 'btn btn-falhaNovaDataEvento btn-sm',
                    textoBotao: 'Ver',
                    backgroundList:'background-color: #CB2D59;',
                    colorList: 'color: #CB2D59;'
                }
                , {
                    id: 'ATRASADO',
                    divClass: 'col-lg-2 eventosCol3Atraso',
                    textoClass: 'eventosEstadoAtraso',
                    textoClassLista: 'eventosEstadoAtrasoLista',
                    botaoClass: 'btn btn-atrasoEvento btn-lg btn-block',
                    botaoListClass: 'btn btn-atrasoEvento btn-sm btn-block',
                    botaoProrrogacaoClass: 'btn-atrasoNovaDataEvento',
                    botaoProrrogacaoClassList: 'btn btn-atrasoNovaDataEvento btn-sm',
                    textoBotao: 'Atrasado',
                    backgroundList:'',
                    colorList: 'color: #FFB54B;'
                }

            ],
            EnumMeses: {
                1: 'Janeiro',
                2: 'Fevereiro',
                3: 'Março',
                4: 'Abril',
                5: 'Maio',
                6: 'Junho',
                7: 'Julho',
                8: 'Agosto',
                9: 'Setembro',
                10: 'Outubro',
                11: 'Novembro',
                12: 'Dezembro'
            },
            EstadosTela: [
                {id: 'visualizar', nome: 'VISUALIZAR', class: 'fa fa-search fa-1x'},
                {id: 'editar', nome: 'EDITAR', class: 'fa fa-pencil-alt fa-1x'},
                {id: 'novo', nome: 'CADASTRAR', class: 'fa fa-pencil-alt fa-1x'}
            ],
            EnumTipoPessoaConta:[
                {id: 'FISICA', nome: 'Física'},
                {id: 'JURIDICA', nome: 'Jurídica'}
            ],
            EnumTipoContasPagar: [
                {id: 'FIXA', nome: 'Fixa'},
                {id: 'VARIAVEL', nome: 'Variável'}
            ],
            EnumFrequenciaContasPagar: [
                {id: 'EXTRAORDINARIA', nome: 'Extraordinária'},
                {id: 'SEMANAL', nome: 'Semanal'},
                // {id: 'QUINZENAL', nome: 'Quinzenal'},
                {id: 'MENSAL', nome: 'Mensal'},
                // {id: 'BIMESTRAL', nome: 'Bimestral'},
                // {id: 'TRIMESTRAL', nome: 'Trimestral'},
                // {id: 'SEMESTRAL', nome: 'Semestral'},
                {id: 'ANUAL', nome: 'Anual'}
            ],
            EnumSituacaoProcesso: [
                {id: 'ATIVO', nome: 'Ativo'},
                {id: 'FINALIZADO', nome: 'Finalizado'},
            ]
        }
    });
});