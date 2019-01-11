'use strict';

describe('altImportacaoCsvEspecifica', function() {
  var _compile, _rootScope, _scope, _directiveScope, _element, _ctrl,
  _importacaoEspecificaService, _evento, _modalService, _OpcoesImportacao, _mockPessoas, 
  _mockCategorias, _mockCampos, _mockArquivo, _CampoImportacao, _timeout, _alertaService;

  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    _rootScope = $injector.get('$rootScope');
    _scope = _rootScope.$new();
    _compile = $injector.get('$compile');
    _timeout = $injector.get('$timeout');
    _importacaoEspecificaService = $injector.get('AltImportacaoCsvEspecificaService');
    _evento = $injector.get('AltImportacaoCsvEvento');
    _modalService = $injector.get('AltModalService');
    _OpcoesImportacao = $injector.get('AltImportacaoCsvOpcoesModel');
    _CampoImportacao = $injector.get('AltImportacaoCsvCampoModel');
    _alertaService = $injector.get('AltAlertaFlutuanteService');

    spyOn(_modalService, 'open').and.callFake(angular.noop);
    spyOn(_modalService, 'close').and.callFake(angular.noop);
    spyOn(_alertaService, 'exibe').and.callFake(angular.noop);

    _mockPessoas = [
      {idUnico: 1, nome: 'Consumidor Final', tpPessoaGrupo: 'Clientes', tpPessoaGrupoEnum: 0}
    ];
    _mockCategorias = [
      {id: 1, nome: 'Receitas com Vendas'}
    ];
    _mockCampos = [
      new _CampoImportacao({
        nome: 'Pessoa',
        chave: 'pessoa',
        obrigatorio: true,
        tipo: Object,
        objetoChave: 'idUnico',
        objetoReferencia: 'nome',
        objetoListagem: () => {
          return _mockPessoas;
        },
        objetoOpcoesListagem: {
          groupBy: 'tpPessoaGrupo',
          orderBy: ['tpPessoaGrupo', 'nome']
        },
        objetoCriarNovo: {
          funcao: () => {},
          eventoAtualizacao: 'fake-event:pessoa_criada'
        }
      }),
      new _CampoImportacao({
        nome: 'Categoria',
        chave: 'categoria',
        obrigatorio: true,
        tipo: Object,
        objetoChave: 'id',
        objetoReferencia: 'nome',
        objetoListagem: () => {
          return _mockCategorias;
        }
      }),
      new _CampoImportacao({
        nome: 'Data Emissão',
        chave: 'dataEmissao',
        obrigatorio: true,
        tipo: Date,
        template: {
          width: 4
        }
      }),
      new _CampoImportacao({
        nome: 'Valor Total',
        chave: 'valor',
        obrigatorio: true,
        tipo: Number,
        monetario: true,
        template: {
          width: 4
        }
      }),
      new _CampoImportacao({
        nome: 'Observação',
        chave: 'observacao'
      })
    ];
    _mockArquivo = {
      "nome": "alelo_pessoas_categorias.xlsx",
      "linhas": [
        {
          "Data da venda": "12/11/2017",
          "Resumo de Operação": "teste",
          "Descrição": "Alelo Refeição",
          "Valor de Desconto (R$)": "9.92",
          "Taxa (%)": "5.99",
          "Tarifa (R$)": "-0.59",
          "Data prevista de pagamento": "14/11/2017",
          "Valor Líquido das Vendas": "9.33",
          "Pessoa": "Joaquim Bryan Souza",
          "Categoria": "Receitas com vendas"
        },
        {
          "Data da venda": "23/11/2016",
          "Resumo de Operação": "5171113",
          "Descrição": "Alelo Refeição",
          "Valor de Desconto (R$)": "13.21",
          "Taxa (%)": "5.99",
          "Tarifa (R$)": "-0.79",
          "Data prevista de pagamento": "14/12/2017",
          "Valor Líquido das Vendas": "12.42",
          "Pessoa": "Consumidor Final",
          "Categoria": "Receitas com vendas"
        },
        {
          "Data da venda": "5/11/2017",
          "Resumo de Operação": "5171111",
          "Descrição": "Alelo Refeição",
          "Valor de Desconto (R$)": "28.66",
          "Taxa (%)": "5.99",
          "Tarifa (R$)": "-1.72",
          "Data prevista de pagamento": "12/12/2017",
          "Valor Líquido das Vendas": "34.2694",
          "Pessoa": "Consumidor Final",
          "Categoria": "Receitas com vendas"
        },
        {
          "Data da venda": "11/11/2017",
          "Resumo de Operação": "5171111",
          "Descrição": "Alelo Refeição",
          "Valor de Desconto (R$)": "36.96",
          "Taxa (%)": "5.99",
          "Tarifa (R$)": "-2.21",
          "Data prevista de pagamento": "12/12/2017",
          "Valor Líquido das Vendas": "AA",
          "Pessoa": "CoNSUmídor final",
          "Categoria": "Receitas com vendas"
        },
        {
          "Data da venda": "10/11/2017",
          "Resumo de Operação": "5171110",
          "Descrição": "Alelo Refeição",
          "Valor de Desconto (R$)": "16.3",
          "Taxa (%)": "5.99",
          "Tarifa (R$)": "-0.98",
          "Data prevista de pagamento": "11/12/2017",
          "Valor Líquido das Vendas": "15.32",
          "Pessoa": "Consumidor Final",
          "Categoria": "Receitas com vendas"
        }
      ],
      "colunas": [
        "Data da venda",
        "Resumo de Operação",
        "Descrição",
        "Valor de Desconto (R$)",
        "Taxa (%)",
        "Tarifa (R$)",
        "Data prevista de pagamento",
        "Valor Líquido das Vendas",
        "Pessoa",
        "Categoria"
      ],
      "extensao": "xlsx",
      "valido": true,
      "mensagem": ""
    }
  }));

  var _criarComponente = function() {
    var html = 
    '<div alt-importacao-csv-especifica></div>';
    _element = angular.element(html);
    _compile(_element)(_scope);
    
    _scope.$digest();
    _directiveScope = _element.isolateScope();
    _ctrl = _directiveScope.importacaoCsvCtrl;
  };

  describe('_inicializar()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
    });
    it('deve configurar opcoes corretamente', function() {
      _importacaoEspecificaService.exibe(opcoes);

      expect(_ctrl.labelTipo).toBe(opcoes.labelTipo);
      expect(_ctrl.validarLote).toBe(opcoes.validarLote);
      expect(_ctrl.gravarLote).toBe(opcoes.gravarLote);
      expect(_ctrl.eventoCriacao).toBe(opcoes.eventoCriacao);
      expect(_ctrl.campos).toEqual(opcoes.campos);
      expect(_ctrl.camposConfigurados).toEqual(opcoes.campos);
    });
    it('deve inicializar propriedades nulas', function() {
      _ctrl.campoSelecionado = {};
      _ctrl.colunaSelecionada = {};
      _ctrl.arquivoAnterior = {};
      _ctrl.arquivo = {};
      _ctrl.lote = {};

      _importacaoEspecificaService.exibe(opcoes);

      expect(_ctrl.arquivoAnterior).toBe(null);
      expect(_ctrl.arquivo).toBe(null);
      expect(_ctrl.lote).toBe(null);
    });
  });

  describe('_inicializarMapeamento()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _directiveScope.$digest();

      _ctrl.arquivo = _mockArquivo;
      _ctrl.nextStep();
    });
    it('deve inicializar modelo importacao', function() {
      expect(_ctrl.importacao).toBeDefined();
    });
    it('deve atribuir as colunas conforme primeira linha', function() {
      expect(_ctrl.importacao.colunas[0].nome).toBe(Object.keys(_mockArquivo.linhas[0])[0]);
      expect(_ctrl.importacao.colunas[1].nome).toBe(Object.keys(_mockArquivo.linhas[0])[1]);
      expect(_ctrl.importacao.colunas[2].nome).toBe(Object.keys(_mockArquivo.linhas[0])[2]);
      expect(_ctrl.importacao.colunas[3].nome).toBe(Object.keys(_mockArquivo.linhas[0])[3]);
    });
    it('deve validar o mapa', function() {
      expect(_ctrl.importacao.mapaInvalido).toBe(true);
    });
  });

  describe('_inicializarRegras()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();
    });
    it('deve aplicar as regras de valor na importacao', function() {
      expect(_ctrl.resumoRegrasDeValor).toBeDefined();
    });
  });

  describe('_inicializarRegras() - com prevStep', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.prevStep();
      _ctrl.nextStep();
      _ctrl.nextStep();
    });
    it('deve manter vinculo dos campos', function() {
      expect(_ctrl.importacao.campos[0].coluna).toBe(9);
    });
  });

  /* describe('_inicializarRevisao()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve({test: 'fake-lote-ok'})});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });

      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();

      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();
      
      var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
      regraJoaquim.objeto = _mockPessoas[0];
      _ctrl.resumirRegrasDeValor();
      _ctrl.nextStep();
    });
    
    it('deve chamar validarLote() e atribuir resultado na controller', function(done) {
      setTimeout(() => {
        expect(_ctrl.lote).toEqual({test: 'fake-lote-ok', exibir: 'todos'});
        done();
      }, 100);
    });

  }); */

  describe('_visualizarProcessado()', function() {
    var opcoes, mockLoteProcessado;
    beforeEach(function() {
      mockLoteProcessado = {
        dataProcessado: new Date(),
        itens: [
          {
            idObjeto: 85,
            resumo: {
              campos: [
                {
                  valido: true,
                  chave: "pessoa",
                  dado: "",
                  referencia: "Joaquim do Teste Unitário",
                  template: {
                    width: 12,
                    label: "Pessoa"
                  }
                },
                {
                  valido: true,
                  chave: "categoria",
                  dado: "",
                  referencia: "Receitas com vendas",
                  template: {
                    width: 12,
                    label: "Categoria"
                  }
                },
                {
                  valido: true,
                  chave: "dataEmissao",
                  dado: "18/04/18",
                  referencia: "18/04/2018",
                  template: {
                    width: 4,
                    label: "Data Emissão"
                  }
                },
                {
                  valido: true,
                  chave: "valor",
                  dado: "50.89",
                  referencia: "R$ 50,89",
                  template: {
                    width: 4,
                    label: "Valor Total"
                  }
                }
              ]
            },
            possuiErro: false,
            possuiConflito: false
          },
          {
            resumo: {
              campos: [
                {
                  valido: true,
                  chave: "pessoa",
                  dado: "",
                  referencia: "Joaquim do Teste Unitário",
                  template: {
                    width: 12,
                    label: "Pessoa"
                  }
                },
                {
                  valido: true,
                  chave: "categoria",
                  dado: "",
                  referencia: "Receitas com vendas",
                  template: {
                    width: 12,
                    label: "Categoria"
                  }
                },
                {
                  valido: true,
                  chave: "dataEmissao",
                  dado: "18/04/18",
                  referencia: "18/04/2018",
                  template: {
                    width: 4,
                    label: "Data Emissão"
                  }
                },
                {
                  valido: true,
                  chave: "valor",
                  dado: "50.89",
                  referencia: "R$ 50,89",
                  template: {
                    width: 4,
                    label: "Valor Total"
                  }
                }
              ],
              mensagens: [
                {
                  textoHtml: 'Teste <i>aviso</i> <b>texto</b> em <u>html</u>!'
                }
              ]
            },
            possuiErro: true,
            possuiConflito: false
          },
          {
            idObjeto: 85,
            resumo: {
              campos: [
                {
                  valido: true,
                  chave: "pessoa",
                  dado: "",
                  referencia: "Joaquim do Teste Unitário",
                  template: {
                    width: 12,
                    label: "Pessoa"
                  }
                },
                {
                  valido: true,
                  chave: "categoria",
                  dado: "",
                  referencia: "Receitas com vendas",
                  template: {
                    width: 12,
                    label: "Categoria"
                  }
                },
                {
                  valido: true,
                  chave: "dataEmissao",
                  dado: "18/04/18",
                  referencia: "18/04/2018",
                  template: {
                    width: 4,
                    label: "Data Emissão"
                  }
                },
                {
                  valido: true,
                  chave: "valor",
                  dado: "50.89",
                  referencia: "R$ 50,89",
                  template: {
                    width: 4,
                    label: "Valor Total"
                  }
                }
              ],
              mensagens: [
                {
                  texto: 'Teste aviso!'
                }
              ]
            },
            possuiErro: false,
            possuiConflito: true
          }
        ]
      };
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        labelTipoSingular: 'venda',
        campos: _mockCampos,
        visualizacao: true,
        loteProcessado: mockLoteProcessado
      });

      _importacaoEspecificaService.exibe(opcoes);
    });
    it('deve criar lote com os itens do processado', function() {
      expect(_ctrl.lote).toBeDefined();
      expect(_ctrl.lote.itens).toEqual(mockLoteProcessado.itens);
    });
    it('deve resumir corretamente o lote', function() {
      expect(_ctrl.lote.erros).toBe(1);
      expect(_ctrl.lote.validos).toBe(1);
      expect(_ctrl.lote.conflitos).toBe(1);
    });
  });

  describe('arquivoAlterado()', function() {
    var opcoes, _mockArquivo2;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
    });

    describe('- etapaInicial, arquivo com mesmo nome -', function() {
      beforeEach(function() {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _directiveScope.$digest();
  
        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[1]['Pessoa'] = 'Inexistente da Silva';
        _ctrl.arquivo = _mockArquivo2;
      });
      it('não deve atualizar campos configurados', function() {
        _ctrl.campos[0].teste = 'campo alterado';
        _ctrl.arquivoAlterado();
        expect(_ctrl.campos[0].teste).toBe('campo alterado');
      });
    });

    describe('- etapaInicial, arquivo com outro nome -', function() {
      beforeEach(function() {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _directiveScope.$digest();

        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[1]['Pessoa'] = 'Inexistente da Silva';
        _mockArquivo2.nome = 'outro_nome.xlsx';
        _ctrl.arquivo = _mockArquivo2;
      });
      it('deve atualizar campos configurados', function() {
        _ctrl.campos[0].teste = 'campo alterado';
        _ctrl.arquivoAlterado();
        expect(_ctrl.campos[0].teste).toBe(undefined);
      });
    });

    describe('- etapaRegras, arquivo mesmo nome -', function() {
      beforeEach(function() {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _directiveScope.$digest();
  
        _ctrl.resumoRegrasDeValor = null;
        _ctrl.nextStep();
        _ctrl.vincular('pessoa', 9);
        _ctrl.vincular('categoria', 10);
        _ctrl.vincular('dataEmissao', 1);
        _ctrl.vincular('valor', 8);
        _ctrl.vincular('observacao', 3);
        _ctrl.nextStep();
  
        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[1]['Pessoa'] = 'Inexistente da Silva';
        _ctrl.arquivo = _mockArquivo2;
      });
      it('deve atualizar resumo com novo arquivo', function() {
        expect(_ctrl.resumoRegrasDeValor.nulosInvalidos).toBe(1);
        _ctrl.arquivoAlterado();
        expect(_ctrl.resumoRegrasDeValor.nulosInvalidos).toBe(2);
      });
    });

    describe('- etapaRegras, arquivo outro nome -', function() {
      beforeEach(function() {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _directiveScope.$digest();
  
        _ctrl.resumoRegrasDeValor = null;
        _ctrl.nextStep();
        _ctrl.vincular('pessoa', 9);
        _ctrl.vincular('categoria', 10);
        _ctrl.vincular('dataEmissao', 1);
        _ctrl.vincular('valor', 8);
        _ctrl.vincular('observacao', 3);
        _ctrl.nextStep();
  
        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[1]['Pessoa'] = 'Inexistente da Silva';
        _mockArquivo2.nome = 'outro_nome.xlsx';
        _ctrl.arquivo = _mockArquivo2;
      });
      it('deve voltar ao arquivo inicial', function() {
        _ctrl.arquivoAlterado();
        expect(_ctrl.arquivo.linhas[1]['Pessoa']).toBe('Consumidor Final');
      });
      it('deve exibir alerta de documento inválido', function() {
        _ctrl.arquivoAlterado();
        expect(_alertaService.exibe).toHaveBeenCalledWith({msg: 'O nome do documento deve coincidir com o do arquivo da importação.'});
      });
    });

    /* describe('- etapaRevisao, arquivo mesmo nome -', function() {
      beforeEach(function(done) {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _directiveScope.$digest();
  
        _ctrl.resumoRegrasDeValor = null;
        _ctrl.nextStep();
        _ctrl.vincular('pessoa', 9);
        _ctrl.vincular('categoria', 10);
        _ctrl.vincular('dataEmissao', 1);
        _ctrl.vincular('valor', 8);
        _ctrl.vincular('observacao', 3);
        _ctrl.nextStep();

        var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
        regraJoaquim.objeto = _mockPessoas[0];
        _ctrl.resumirRegrasDeValor();
        _ctrl.nextStep();

        setTimeout(() => {
          done();
        }, 100);
      });
      it('deve atualizar lote com novo arquivo', function(done) {
        expect(_ctrl.lote.erros).toBe(1);
        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[0]['Valor Líquido das Vendas'] = 'x';
        _ctrl.arquivo = _mockArquivo2;
        _ctrl.arquivoAlterado();

        setTimeout(() => {
          expect(_ctrl.lote.erros).toBe(2);
          done();
        }, 100);
      });
    });

    describe('- etapaRevisao, arquivo outro nome -', function() {
      beforeEach(function(done) {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _directiveScope.$digest();
  
        _ctrl.resumoRegrasDeValor = null;
        _ctrl.nextStep();
        _ctrl.vincular('pessoa', 9);
        _ctrl.vincular('categoria', 10);
        _ctrl.vincular('dataEmissao', 1);
        _ctrl.vincular('valor', 8);
        _ctrl.vincular('observacao', 3);
        _ctrl.nextStep();

        var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
        regraJoaquim.objeto = _mockPessoas[0];
        _ctrl.resumirRegrasDeValor();
        _ctrl.nextStep();

        setTimeout(() => {
          done();
        }, 100);
      });
      it('deve voltar ao arquivo inicial', function(done) {
        expect(_ctrl.lote.erros).toBe(1);
        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[0]['Valor Líquido das Vendas'] = 'x';
        _mockArquivo2.nome = 'outro_nome.xlsx';
        _ctrl.arquivo = _mockArquivo2;
        _ctrl.arquivoAlterado();

        setTimeout(() => {
          expect(_ctrl.lote.erros).toBe(1);
          expect(_ctrl.arquivo.linhas[0]['Valor Líquido das Vendas']).toBe('9.33');
          done();
        }, 100);
      });
      it('deve exibir alerta de documento inválido', function(done) {
        expect(_ctrl.lote.erros).toBe(1);
        _mockArquivo2 = angular.copy(_mockArquivo);
        _mockArquivo2.linhas[0]['Valor Líquido das Vendas'] = 'x';
        _mockArquivo2.nome = 'outro_nome.xlsx';
        _ctrl.arquivo = _mockArquivo2;
        _ctrl.arquivoAlterado();

        setTimeout(() => {
          expect(_alertaService.exibe).toHaveBeenCalledWith({msg: 'O nome do documento deve coincidir com o do arquivo da importação.'});
          done();
        }, 100);
      });
    }); */

  });

  describe('invalidStep()', function() {
    var opcoes, _mockArquivo2;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
    });

    describe('- etapa 1', function() {
      describe('- sem arquivo -', function() {
        it('deve considerar etapa inválida', function() {
          expect(_ctrl.invalidStep()).toBe(true);
        });
      });
      describe('- com arquivo inválido -', function() {
        beforeEach(function() {
          _mockArquivo2 = angular.copy(_mockArquivo);
          _mockArquivo2.valido = false;
          _ctrl.arquivo = _mockArquivo2;
          _ctrl.arquivoAlterado();
        });
        it('deve considerar etapa inválida', function() {
          expect(_ctrl.invalidStep()).toBe(true);
        });
      });
      describe('- com arquivo válido -', function() {
        beforeEach(function() {
          _ctrl.arquivo = _mockArquivo;
          _ctrl.arquivoAlterado();
        });
        it('deve considerar etapa válida', function() {
          expect(_ctrl.invalidStep()).toBe(false);
        });
      });
    });

    describe('- etapa 2', function() {
      beforeEach(function() {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _ctrl.nextStep();
      });
      describe('- mapa inválido -', function() {
        it('deve considerar etapa inválida', function() {
          expect(_ctrl.invalidStep()).toBe(true);
        });
      });
      describe('- mapa válido -', function() {
        beforeEach(function() {
          _ctrl.vincular('pessoa', 9);
          _ctrl.vincular('categoria', 10);
          _ctrl.vincular('dataEmissao', 1);
          _ctrl.vincular('valor', 8);
        });
        it('deve considerar etapa válida', function() {
          expect(_ctrl.invalidStep()).toBe(false);
        });
      });
    });

    describe('- etapa 3', function() {
      beforeEach(function() {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _ctrl.nextStep();
        _ctrl.vincular('pessoa', 9);
        _ctrl.vincular('categoria', 10);
        _ctrl.vincular('dataEmissao', 1);
        _ctrl.vincular('valor', 8);
        _ctrl.nextStep();
      });
      describe('- com nulos inválidos -', function() {
        it('deve considerar etapa inválida', function() {
          expect(_ctrl.invalidStep()).toBe(true);
        });
      });
      describe('- sem nulos inválidos -', function() {
        beforeEach(function() {
          var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
          regraJoaquim.objeto = _mockPessoas[0];
          _ctrl.resumirRegrasDeValor();
        });
        it('deve considerar etapa válida', function() {
          expect(_ctrl.invalidStep()).toBe(false);
        });
      });
    });

    /* describe('- etapa 4', function() {
      beforeEach(function(done) {
        _ctrl.arquivo = _mockArquivo;
        _ctrl.arquivoAlterado();
        _ctrl.nextStep();
        _ctrl.vincular('pessoa', 9);
        _ctrl.vincular('categoria', 10);
        _ctrl.vincular('dataEmissao', 1);
        _ctrl.vincular('valor', 8);
        _ctrl.nextStep();
        var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
        regraJoaquim.objeto = _mockPessoas[0];
        _ctrl.resumirRegrasDeValor();
        _ctrl.nextStep();
        setTimeout(() => {
          done();
        }, 100);
      });
      describe('- lote com erros -', function() {
        it('deve considerar etapa inválida', function() {
          expect(_ctrl.invalidStep()).toBe(true);
        });
      });
      describe('- lote sem erros -', function() {
        beforeEach(function() {
          _ctrl.lote.desconsiderarItem(3);
        });
        it('deve considerar etapa válida', function() {
          expect(_ctrl.invalidStep()).toBe(false);
        });
      });
    }); */
  });

  describe('vincular()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _ctrl.arquivoAlterado();
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _directiveScope.$digest();
      _timeout.flush();
    });
    it('deve vincular corretamente a coluna ao campo', function() {
      expect(_ctrl.importacao.campos[0].coluna).toBe(9);
    });
  });

  describe('desvincular()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _ctrl.arquivoAlterado();
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();
    });
    it('deve remover campo coluna e regrasDeValor do campo', function() {
      expect(_ctrl.importacao.campos[0].coluna).toBeDefined();
      expect(_ctrl.importacao.campos[0].regrasDeValor).toBeDefined();
      _ctrl.prevStep();
      _ctrl.desvincular('pessoa');
      expect(_ctrl.importacao.campos[0].coluna).toBeUndefined();
      expect(_ctrl.importacao.campos[0].regrasDeValor).toBeUndefined();
    });
  });

  describe('campoNaoMapeado()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _ctrl.arquivoAlterado();
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
    });
    it('deve retornar falso quando campo possui vinculo', function() {
      expect(_ctrl.campoNaoMapeado(_ctrl.importacao.campos[0])).toBe(false);
    });
    it('deve retornar verdadeiro quando campo não possui vinculo', function() {
      expect(_ctrl.campoNaoMapeado(_ctrl.importacao.campos[1])).toBe(true);
    });
  });

  describe('resumirRegrasDeValor()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _ctrl.arquivoAlterado();
      _directiveScope.$digest();

      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();
    });

    describe('- exibir nulosValidos, sem valores -', function() {
      beforeEach(function() {
        _ctrl.resumoRegrasDeValor.exibir = 'nulosValidos';
        _ctrl.resumirRegrasDeValor();
      });
      it('deve setar para exibir todos', function() {
        expect(_ctrl.resumoRegrasDeValor.exibir).toBe('todos');
      });
    });

    describe('- exibir nulosInvalidos, sem valores -', function() {
      beforeEach(function() {
        var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
        regraJoaquim.objeto = _mockPessoas[0];
        _ctrl.resumoRegrasDeValor.exibir = 'nulosInvalidos';
        _ctrl.resumirRegrasDeValor();
      });
      it('deve setar para exibir todos', function() {
        expect(_ctrl.resumoRegrasDeValor.exibir).toBe('todos');
      });
    });
  });

  describe('limparRegra()', function() {
    var opcoes;
    beforeEach(function() {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _ctrl.arquivoAlterado();
      _directiveScope.$digest();

      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();
    });
    describe('- campo com opção Criar Novo -', function() {
      beforeEach(function() {
        var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
        regraJoaquim.objeto = _mockPessoas[0];
        _ctrl.resumirRegrasDeValor();
      });
      it('deve atualizar o resumo das regras corretamente', function() {
        expect(_ctrl.resumoRegrasDeValor.nulosInvalidos).toBe(0);
        _ctrl.limparRegra(_ctrl.importacao.campos[0], _.findIndex(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'}));
        expect(_ctrl.resumoRegrasDeValor.nulosInvalidos).toBe(1);
      });
      it('deve remover objeto da regra', function() {
        _ctrl.limparRegra(_ctrl.importacao.campos[0], _.findIndex(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'}));
        var regra = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
        expect(regra.objeto).toBe(undefined);
      });
    });
    describe('- campo sem opção Criar Novo -', function() {
      it('deve atualizar o resumo das regras corretamente', function() {
        expect(_ctrl.resumoRegrasDeValor.nulosInvalidos).toBe(1);
        _ctrl.limparRegra(_ctrl.importacao.campos[1], _.findIndex(_ctrl.importacao.campos[1].regrasDeValor, {valor: 'Receitas com vendas'}));
        expect(_ctrl.resumoRegrasDeValor.nulosInvalidos).toBe(2);
      });
      it('deve remover objeto da regra', function() {
        _ctrl.limparRegra(_ctrl.importacao.campos[1], _.findIndex(_ctrl.importacao.campos[1].regrasDeValor, {valor: 'Receitas com vendas'}));
        var regra = _.find(_ctrl.importacao.campos[1].regrasDeValor, {valor: 'Receitas com vendas'});
        expect(regra.objeto).toBe(undefined);
      });
    });
  });

  describe('criarNovoObjetoDeRegra()', function() {
    var opcoes, objetoCriado;
    beforeEach(function(done) {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return {}});}
      });
      _importacaoEspecificaService.exibe(opcoes);
      _ctrl.arquivo = _mockArquivo;
      _ctrl.arquivoAlterado();
      _directiveScope.$digest();
      
      _ctrl.nextStep();
      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();

      _ctrl.importacao.campos[0].objetoCriarNovo = {
        funcao: () => {
          _rootScope.$broadcast('importacao_test_unitario:objeto_criado', {teste: 'teste'});
        },
        eventoAtualizacao: 'importacao_test_unitario:objeto_criado'
      };
      _ctrl.criarNovoObjetoDeRegra('pessoa', 0);
      _timeout.flush();
      done();
    });
    it('deve fechar modal de importacao', function() {
      expect(_modalService.close).toHaveBeenCalledWith('#alt-importacao-csv-modal');
    });
  });

  describe('ngOptionsRegraDeCampo()', function() {
    var ngOptions;
    beforeEach(function() {
      _criarComponente();
    });
    describe('- campo sem groupBy e sem orderBy -', function() {
      beforeEach(function() {
        ngOptions = _ctrl.ngOptionsRegraDeCampo({
          objetoOpcoesListagem: {}
        });
      });
      it('deve retornar corretamente o options do select', function() {
        expect(ngOptions).toBe('obj as obj[campo.objetoReferencia]  for obj in campo.objetoListagem()  track by obj[campo.objetoChave]');
      })
    });
    describe('- campo sem groupBy e com orderBy -', function() {
      beforeEach(function() {
        ngOptions = _ctrl.ngOptionsRegraDeCampo({
          objetoOpcoesListagem: {
            orderBy: ['nome', 'dataCadastro']
          }
        });
      });
      it('deve retornar corretamente o options do select', function() {
        expect(ngOptions).toBe('obj as obj[campo.objetoReferencia]  for obj in campo.objetoListagem() | orderBy:[\'nome\',\'dataCadastro\'] track by obj[campo.objetoChave]');
      });
    });
    describe('- campo com groupBy e com orderBy -', function() {
      beforeEach(function() {
        ngOptions = _ctrl.ngOptionsRegraDeCampo({
          objetoOpcoesListagem: {
            groupBy: 'categoria',
            orderBy: ['nome', 'dataCadastro']
          }
        });
      });
      it('deve retornar corretamente o options do select', function() {
        expect(ngOptions).toBe('obj as obj[campo.objetoReferencia] group by obj[campo.objetoOpcoesListagem.groupBy]  for obj in campo.objetoListagem() | orderBy:[\'nome\',\'dataCadastro\'] track by obj[campo.objetoChave]');
      });
    });
  });

  describe('salvarImportacao()', function() {
    var opcoes, itens;
    beforeEach(function(done) {
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        eventoCriacao: 'venda:lote_importacao_criado',
        campos: _mockCampos,
        validarLote: (lote) => {return new Promise((resolve) => {return resolve(lote)});},
        gravarLote: () => {return new Promise((resolve) => {return resolve('lote salvo com sucesso')});}
      });

      _importacaoEspecificaService.exibe(opcoes);
      _mockArquivo.linhas[3]['Valor Líquido das Vendas'] = '11.90';
      _ctrl.arquivo = _mockArquivo;
      _directiveScope.$digest();

      _ctrl.resumoRegrasDeValor = null;
      _ctrl.nextStep();

      _ctrl.vincular('pessoa', 9);
      _ctrl.vincular('categoria', 10);
      _ctrl.vincular('dataEmissao', 1);
      _ctrl.vincular('valor', 8);
      _ctrl.vincular('observacao', 3);
      _ctrl.nextStep();
      
      var regraJoaquim = _.find(_ctrl.importacao.campos[0].regrasDeValor, {valor: 'Joaquim Bryan Souza'});
      regraJoaquim.objeto = _mockPessoas[0];
      _ctrl.resumirRegrasDeValor();
      // _ctrl.nextStep();

      setTimeout(() => {
        spyOn(_rootScope, '$broadcast').and.callFake(angular.noop);
        _ctrl.salvarImportacao();

        setTimeout(() => { done(); }, 100);
      }, 100);
    });
    it('deve deve transmitir evento corretamente', function() {
      expect(_rootScope.$broadcast).toHaveBeenCalledWith('venda:lote_importacao_criado', 'lote salvo com sucesso');
    });
  });

  describe('editarObjeto()', function() {
    var opcoes, mockLoteProcessado, itemEditado;
    beforeEach(function() {
      mockLoteProcessado = {
        dataProcessado: new Date(),
        itens: [
          {
            idObjeto: 85,
            resumo: {
              campos: [
                {
                  valido: true,
                  chave: "pessoa",
                  dado: "",
                  referencia: "Joaquim do Teste Unitário",
                  template: {
                    width: 12,
                    label: "Pessoa"
                  }
                },
                {
                  valido: true,
                  chave: "categoria",
                  dado: "",
                  referencia: "Receitas com vendas",
                  template: {
                    width: 12,
                    label: "Categoria"
                  }
                },
                {
                  valido: true,
                  chave: "dataEmissao",
                  dado: "18/04/18",
                  referencia: "18/04/2018",
                  template: {
                    width: 4,
                    label: "Data Emissão"
                  }
                },
                {
                  valido: true,
                  chave: "valor",
                  dado: "50.89",
                  referencia: "R$ 50,89",
                  template: {
                    width: 4,
                    label: "Valor Total"
                  }
                }
              ]
            },
            possuiErro: false,
            possuiConflito: false,
            editar: () => {
              itemEditado = true;
              _rootScope.$broadcast('teste_importacao_edicao_concluida');
            },
            eventoEdicaoConcluida: 'teste_importacao_edicao_concluida'
          },
          {
            resumo: {
              campos: [
                {
                  valido: true,
                  chave: "pessoa",
                  dado: "",
                  referencia: "Joaquim do Teste Unitário",
                  template: {
                    width: 12,
                    label: "Pessoa"
                  }
                },
                {
                  valido: true,
                  chave: "categoria",
                  dado: "",
                  referencia: "Receitas com vendas",
                  template: {
                    width: 12,
                    label: "Categoria"
                  }
                },
                {
                  valido: true,
                  chave: "dataEmissao",
                  dado: "18/04/18",
                  referencia: "18/04/2018",
                  template: {
                    width: 4,
                    label: "Data Emissão"
                  }
                },
                {
                  valido: true,
                  chave: "valor",
                  dado: "50.89",
                  referencia: "R$ 50,89",
                  template: {
                    width: 4,
                    label: "Valor Total"
                  }
                }
              ],
              mensagens: [
                {
                  textoHtml: 'Teste <i>aviso</i> <b>texto</b> em <u>html</u>!'
                }
              ]
            },
            possuiErro: true,
            possuiConflito: false
          },
          {
            idObjeto: 85,
            resumo: {
              campos: [
                {
                  valido: true,
                  chave: "pessoa",
                  dado: "",
                  referencia: "Joaquim do Teste Unitário",
                  template: {
                    width: 12,
                    label: "Pessoa"
                  }
                },
                {
                  valido: true,
                  chave: "categoria",
                  dado: "",
                  referencia: "Receitas com vendas",
                  template: {
                    width: 12,
                    label: "Categoria"
                  }
                },
                {
                  valido: true,
                  chave: "dataEmissao",
                  dado: "18/04/18",
                  referencia: "18/04/2018",
                  template: {
                    width: 4,
                    label: "Data Emissão"
                  }
                },
                {
                  valido: true,
                  chave: "valor",
                  dado: "50.89",
                  referencia: "R$ 50,89",
                  template: {
                    width: 4,
                    label: "Valor Total"
                  }
                }
              ],
              mensagens: [
                {
                  texto: 'Teste aviso!'
                }
              ]
            },
            possuiErro: false,
            possuiConflito: true
          }
        ]
      };
      _criarComponente();
      opcoes = new _OpcoesImportacao({
        labelTipo: 'vendas',
        labelTipoSingular: 'venda',
        campos: _mockCampos,
        visualizacao: true,
        loteProcessado: mockLoteProcessado
      });

      _importacaoEspecificaService.exibe(opcoes);
      _rootScope.$digest();
      _ctrl.editarObjeto(_ctrl.lote.itens[0]);
      _timeout.flush();
      _rootScope.$digest();
    });
    it('deve fechar a modal do lote', function() {
      expect(_modalService.close).toHaveBeenCalledWith('#alt-importacao-csv-modal');
      expect(itemEditado).toBe(true);
    });
  });

});