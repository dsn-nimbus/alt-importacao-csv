'use strict';

describe('Importacao', function() {
  var Importacao, CampoImportacao, camposMockVenda, produtosMock;
  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    Importacao = $injector.get('AltImportacaoCsvModel');
    CampoImportacao = $injector.get('AltImportacaoCsvCampoModel');

    produtosMock = [
      {id: 1, descricao: 'Notebook ABC DELL'}, 
      {id: 2, descricao: 'SMARTPHONE ABC SANSUNG'}
    ];
    camposMockVenda = [
      new CampoImportacao({
        nome: 'Produto', 
        chave: 'produto',
        tipo: Object,
        objetoChave: 'id',
        objetoReferencia: 'descricao',
        objetoListagem: () => {
          return produtosMock;
        }
      }),
      new CampoImportacao({
        nome: 'Data',
        chave: 'dataVenda',
        obrigatorio: true,
        tipo: Date,
        template: {
          width: 4
        }
      }),
      new CampoImportacao({
        nome: 'Valor Total',
        chave: 'total',
        obrigatorio: true,
        tipo: Number,
        monetario: true
      }),
      new CampoImportacao({
        nome: 'Observações',
        chave: 'observacoes',
        template: {
          label: 'OBS'
        }
      })
    ];
  }));

  describe('constructor(campos)', function() {
    it('deve inicializar corretamente os atributos', function() {
      var campos = [{nome: 'Campo A', chave: 'campoA'}, {nome: 'Campo B', chave: 'campoB'}];
      var importacao = new Importacao(campos);
      expect(importacao.campos).toEqual(angular.copy(campos));
      expect(importacao.colunas).toEqual([]);
      expect(importacao.mapaInvalido).toBe(false);
    });
  });

  describe('validarMapa()', function() {
    var importacao, campos, colunas;
    beforeEach(function() {
      importacao = new Importacao([]);
      importacao.adicionarColuna('Product', 0);
      importacao.adicionarColuna('Date', 1);
      importacao.adicionarColuna('Price', 2);
      importacao.adicionarColuna('Ps', 3);
    });
    describe('- sem campos -', function() {
      beforeEach(function() {
        importacao.campos = [];
        importacao.validarMapa();
      });
      it('deve configurar mapa como válido', function() {
        expect(importacao.mapaInvalido).toBe(false);
      });
    });
    describe('- com campo Object -', function() {
      beforeEach(function() {
        importacao.campos.push(camposMockVenda[0]);
        importacao.validarMapa();
      });
      it('deve configurar mapa como válido', function() {
        expect(importacao.mapaInvalido).toBe(false);
      });
    });
    describe('- com campo não Object, obrigatório, sem vínculo -', function() {
      beforeEach(function() {
        importacao.campos.push(camposMockVenda[1]);
        importacao.validarMapa();
      });
      it('deve configurar mapa como inválido', function() {
        expect(importacao.mapaInvalido).toBe(true);
      });
    });
    describe('- com campo não Object, não obrigatório, sem vínculo -', function() {
      beforeEach(function() {
        importacao.campos.push(camposMockVenda[3]);
        importacao.validarMapa();
      });
      it('deve configurar mapa como válido', function() {
        expect(importacao.mapaInvalido).toBe(false);
      });
    });
    describe('- com campo não Object, obrigatório, com vínculo -', function() {
      beforeEach(function() {
        importacao.campos.push(camposMockVenda[1]);
        importacao.vincular('dataVenda', 2);
        importacao.validarMapa();
      });
      it('deve configurar mapa como válido', function() {
        expect(importacao.mapaInvalido).toBe(false);
      });
    });
    describe('- com campo não Object, não obrigatório, com vínculo -', function() {
      beforeEach(function() {
        importacao.campos.push(camposMockVenda[3]);
        importacao.vincular('Ps', 4);
        importacao.validarMapa();
      });
      it('deve configurar mapa como válido', function() {
        expect(importacao.mapaInvalido).toBe(false);
      });
    });
  });

  describe('adicionarColuna()', function() {
    var importacao;
    beforeEach(function() {
      importacao = new Importacao(camposMockVenda);
      importacao.adicionarColuna('Product', 0);
    });
    it('deve atribuir numero corretamente', function() {
      expect(importacao.colunas[0].numero).toBe(1);
    });
    it('deve atribuir título corretamente', function() {
      expect(importacao.colunas[0].titulo).toBe('Coluna 1 – Product');
    });
  });

  describe('vincular()', function() {
    var importacao;
    beforeEach(function() {
      importacao = new Importacao(camposMockVenda);
      importacao.adicionarColuna('Product', 0);
      importacao.adicionarColuna('Date', 1);
      importacao.adicionarColuna('Price', 2);
    });
    describe('- campo válido (não Object), coluna invalida -', function() {
      beforeEach(function() {
        importacao.vincular('dataVenda', 77);
      });
      it('deve invalidar mapa', function() {
        expect(importacao.mapaInvalido).toBe(true);
      });
    });
    describe('- campo válido (não Object), coluna valida -', function() {
      beforeEach(function() {
        importacao.vincular('dataVenda', 2);
      });
      it('deve invalidar mapa', function() {
        expect(importacao.mapaInvalido).toBe(true);
      });
    });
  });

  describe('desvincular()', function() {
    var importacao;
    describe('- campo obrigatório -', function() {
      beforeEach(function() {
        importacao = new Importacao([_.find(camposMockVenda, {chave: 'total'})]);
        importacao.adicionarColuna('Price', 0);
        importacao.vincular('total', 1);
        importacao.desvincular('total');
      });
      it('deve desvincular corretamente', function() {
        var campo = _.find(importacao.campos, {chave: 'total'});
        expect(campo.coluna).toBe(undefined);
        expect(campo.regrasDeValor).toBe(undefined);
      });
      it('deve atribuir mapa inválido', function() {
        expect(importacao.mapaInvalido).toBe(true);
      });
    });
    describe('- campo não-obrigatório -', function() {
      beforeEach(function() {
        importacao = new Importacao([_.find(camposMockVenda, {chave: 'observacoes'})]);
        importacao.adicionarColuna('Ps', 0);
        importacao.vincular('observacoes', 1);
        importacao.desvincular('observacoes');
      });
      it('deve desvincular corretamente', function() {
        var campo = _.find(importacao.campos, {chave: 'observacoes'});
        expect(campo.coluna).toBe(undefined);
        expect(campo.regrasDeValor).toBe(undefined);
      });
      it('deve atribuir mapa válido', function() {
        expect(importacao.mapaInvalido).toBe(false);
      });
    });
  });

  describe('aplicarRegrasDeValor(linhas)', function() {
    var mockLinhas, importacao;
    beforeEach(function() {
      mockLinhas = [
        {
          'Product': 'Notebook ABC Dell',
          'Date': '11/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': 'Notebook ABC Dell',
          'Date': '12/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': '12983712',
          'Date': '12/05/2018',
          'Price': '2299.99'
        }
      ];
    });

    describe('- campo não Object -', function() {
      beforeEach(function() {
        importacao = new Importacao([_.find(camposMockVenda, {chave: 'total'})]);
        importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('não deve atribuir regras de valor', function() {
        expect(importacao.campos[0].regrasDeValor).toBe(undefined);
      });
    });

    describe('- campo Object - já com regras de valor estabelecidas -', function() {
      beforeEach(function() {
        importacao = new Importacao([_.find(camposMockVenda, {chave: 'produto'})]);
        importacao.campos[0].regrasDeValor = [{valor: '123', objeto: _.find(camposMockVenda, {chave: 'produto'})}]
        importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('não deve modificar regras de valor', function() {
        expect(importacao.campos[0].regrasDeValor).toEqual([{valor: '123', objeto: _.find(camposMockVenda, {chave: 'produto'})}]);
      });
    });

    describe('- campo Object - sem vinculo -', function() {
      beforeEach(function() {
        importacao = new Importacao([_.find(camposMockVenda, {chave: 'produto'})]);
        // importacao.adicionarColuna('Product', 0);
        // importacao.validarMapa();
        importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('deve atribuir regra geral vazia', function() {
        expect(importacao.campos[0].regrasDeValor.length).toBe(1);
        expect(importacao.campos[0].regrasDeValor[0].valor).toBe(null);
        expect(importacao.campos[0].regrasDeValor[0].geral).toBe(true);
        expect(importacao.campos[0].regrasDeValor[0].quantidade).toBe(3);
        expect(importacao.campos[0].regrasDeValor[0].objeto).toBe(null);
      });
    });

    describe('- campo Object - com vinculo -', function() {
      beforeEach(function() {
        importacao = new Importacao([_.find(camposMockVenda, {chave: 'produto'})]);
        importacao.adicionarColuna('Product', 0);
        importacao.vincular('produto', 1);
        importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('deve criar regras de valor corretamente', function() {
        expect(importacao.campos[0].regrasDeValor.length).toBe(2);
        expect(importacao.campos[0].regrasDeValor[0].valor).toBe('12983712');
        expect(importacao.campos[0].regrasDeValor[1].valor).toBe('Notebook ABC Dell');
      });
      it('deve vincular objeto automaticamente quando aplicável', function() {
        expect(importacao.campos[0].regrasDeValor.length).toBe(2);
        expect(importacao.campos[0].regrasDeValor[0].objeto).toBe(undefined);
        expect(importacao.campos[0].regrasDeValor[1].objeto).toEqual(_.find(produtosMock, {descricao: 'Notebook ABC DELL'}));
      });
    });

  });

  describe('resumirRegrasDeValor()', function() {
    var importacao, resumo, mockLinhas, mockLinhas2;
    beforeEach(function() {
      importacao = new Importacao(camposMockVenda);
      mockLinhas = [
        {
          'Product': 'Notebook ABC Dell',
          'Date': '11/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': 'Notebook ABC Dell',
          'Date': '12/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': '12983712',
          'Date': '12/05/2018',
          'Price': '2299.99'
        }
      ];
      mockLinhas2 = [
        {
          'Product': 'Notebook ABC Dell_2',
          'Date': '11/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': '12983712',
          'Date': '12/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': '12983712',
          'Date': '13/05/2018',
          'Price': '2299.99'
        }
      ];
    });

    describe('- objeto obrigatório, sem vinculo, sem regra preenchida -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(importacao.campos, {chave: 'produto'});
        campo.obrigatorio = true;

        resumo = importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('deve totalizar valores do campo corretamente', function() {
        expect(campo.resumoRegrasDeValor).toBeDefined();
        expect(campo.resumoRegrasDeValor.valores).toBe(1);
        expect(campo.resumoRegrasDeValor.vinculados).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosValidos).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosInvalidos).toBe(1);
      });
      it('deve totalizar valores do resumo corretamente', function() {
        expect(resumo.valores).toBe(1);
        expect(resumo.vinculados).toBe(0);
        expect(resumo.nulosValidos).toBe(0);
        expect(resumo.nulosInvalidos).toBe(1);
      });
    });

    describe('- objeto obrigatório, com vinculo, sem regra preenchida -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(importacao.campos, {chave: 'produto'});
        campo.obrigatorio = true;
        importacao.adicionarColuna('Product', 0);
        importacao.vincular('produto', 1);

        resumo = importacao.aplicarRegrasDeValor(mockLinhas2);
      });
      it('deve totalizar valores do campo corretamente', function() {
        expect(campo.resumoRegrasDeValor).toBeDefined();
        expect(campo.resumoRegrasDeValor.valores).toBe(2);
        expect(campo.resumoRegrasDeValor.vinculados).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosValidos).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosInvalidos).toBe(2);
      });
      it('deve totalizar valores do resumo corretamente', function() {
        expect(resumo.valores).toBe(2);
        expect(resumo.vinculados).toBe(0);
        expect(resumo.nulosValidos).toBe(0);
        expect(resumo.nulosInvalidos).toBe(2);
      });
    });

    describe('- objeto obrigatório, com vinculo, com regra preenchida -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(importacao.campos, {chave: 'produto'});
        campo.obrigatorio = true;
        importacao.adicionarColuna('Product', 0);
        importacao.vincular('produto', 1);

        resumo = importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('deve totalizar valores do campo corretamente', function() {
        expect(campo.resumoRegrasDeValor).toBeDefined();
        expect(campo.resumoRegrasDeValor.valores).toBe(2);
        expect(campo.resumoRegrasDeValor.vinculados).toBe(1);
        expect(campo.resumoRegrasDeValor.nulosValidos).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosInvalidos).toBe(1);
      });
      it('deve totalizar valores do resumo corretamente', function() {
        expect(resumo.valores).toBe(2);
        expect(resumo.vinculados).toBe(1);
        expect(resumo.nulosValidos).toBe(0);
        expect(resumo.nulosInvalidos).toBe(1);
      });
    });

    describe('- objeto não-obrigatório, sem vinculo, sem regra preenchida -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(importacao.campos, {chave: 'produto'});
        campo.obrigatorio = false;

        resumo = importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('deve totalizar valores do campo corretamente', function() {
        expect(campo.resumoRegrasDeValor).toBeDefined();
        expect(campo.resumoRegrasDeValor.valores).toBe(1); // regra geral
        expect(campo.resumoRegrasDeValor.vinculados).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosValidos).toBe(1);
        expect(campo.resumoRegrasDeValor.nulosInvalidos).toBe(0);
      });
      it('deve totalizar valores do resumo corretamente', function() {
        expect(resumo.valores).toBe(1);
        expect(resumo.vinculados).toBe(0);
        expect(resumo.nulosValidos).toBe(1);
        expect(resumo.nulosInvalidos).toBe(0);
      });
    });

    describe('- objeto não-obrigatório, com vinculo (com/sem regra) -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(importacao.campos, {chave: 'produto'});
        campo.obrigatorio = false;
        importacao.adicionarColuna('Product', 0);
        importacao.vincular('produto', 1);

        resumo = importacao.aplicarRegrasDeValor(mockLinhas);
      });
      it('deve totalizar valores do campo corretamente', function() {
        expect(campo.resumoRegrasDeValor).toBeDefined();
        expect(campo.resumoRegrasDeValor.valores).toBe(2);
        expect(campo.resumoRegrasDeValor.vinculados).toBe(1);
        expect(campo.resumoRegrasDeValor.nulosValidos).toBe(1);
        expect(campo.resumoRegrasDeValor.nulosInvalidos).toBe(0);
      });
      it('deve totalizar valores do resumo corretamente', function() {
        expect(resumo.valores).toBe(2);
        expect(resumo.vinculados).toBe(1);
        expect(resumo.nulosValidos).toBe(1);
        expect(resumo.nulosInvalidos).toBe(0);
      });
    });

    describe('- objeto não-obrigatório, com vinculo, sem regra preenchida -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(importacao.campos, {chave: 'produto'});
        campo.obrigatorio = false;
        importacao.adicionarColuna('Product', 0);
        importacao.vincular('produto', 1);

        resumo = importacao.aplicarRegrasDeValor(mockLinhas2);
      });
      it('deve totalizar valores do campo corretamente', function() {
        expect(campo.resumoRegrasDeValor).toBeDefined();
        expect(campo.resumoRegrasDeValor.valores).toBe(2);
        expect(campo.resumoRegrasDeValor.vinculados).toBe(0);
        expect(campo.resumoRegrasDeValor.nulosValidos).toBe(2);
        expect(campo.resumoRegrasDeValor.nulosInvalidos).toBe(0);
      });
      it('deve totalizar valores do resumo corretamente', function() {
        expect(resumo.valores).toBe(2);
        expect(resumo.vinculados).toBe(0);
        expect(resumo.nulosValidos).toBe(2);
        expect(resumo.nulosInvalidos).toBe(0);
      });
    });

  });

  describe('montarLote(linhas, loteAnterior)', function() {
    var importacao, mockLinhas;
    beforeEach(function() {
      mockLinhas = [
        {
          'Product': 'Notebook ABC Dell',
          'Date': '11/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': 'Notebook ABC Dell',
          'Date': '12/05/2018',
          'Price': '2299.99'
        },
        {
          'Product': '12983712',
          'Date': '12/05/2018',
          'Price': '2299.99',
          'Ps': 'teste obs notebook.'
        }
      ];
    });

    describe('- campo não-obrigatório, sem vinculo -', function() {
      var campo;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'observacoes'});
        importacao = new Importacao([campo]);
        spyOn(campo, 'validar');
      });
      it('não deve validar o campo', function() {
        importacao.montarLote(mockLinhas);
        expect(campo.validar).not.toHaveBeenCalled();
      });
    });

    describe('- campo não-obrigatório, com vinculo -', function() {
      var campo, lote;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'observacoes'});
        importacao = new Importacao([campo]);

        importacao.adicionarColuna('Ps', 0);
        importacao.vincular('observacoes', 1);
      });
      it('deve validar o campo', function() {
        spyOn(campo, 'validar');
        lote = importacao.montarLote(mockLinhas);

        expect(campo.validar).toHaveBeenCalled();
      });
      it('deve atribuir o dado da linha no item', function() {
        lote = importacao.montarLote(mockLinhas);

        expect(mockLinhas[2]['Ps']).toBe(lote.itens[2]['objeto']['observacoes']);
      });
      it('deve atribuir status corretamente', function() {
        lote = importacao.montarLote(mockLinhas);

        expect(lote.itens[2].possuiErro).toBe(false);
        expect(lote.itens[2].possuiConflito).toBe(false);
      });
    });

    describe('- campo obrigatório, sem vinculo -', function() {
      var campo, lote;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'dataVenda'});
        importacao = new Importacao([campo]);

        // importacao.adicionarColuna('Ps', 0);
        // importacao.vincular('observacoes', 1);
      });
      it('deve validar o campo', function() {
        spyOn(campo, 'validar');
        lote = importacao.montarLote(mockLinhas);

        expect(campo.validar).toHaveBeenCalled();
      });
      it('deve atribuir status corretamente', function() {
        lote = importacao.montarLote(mockLinhas);

        expect(lote.itens[2].possuiErro).toBe(true);
        expect(lote.itens[2].possuiConflito).toBe(false);
      });
    });

    describe('- campo obrigatório, com vinculo (inválido) -', function() {
      var campo, lote;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'dataVenda'});
        importacao = new Importacao([campo]);

        importacao.adicionarColuna('Date', 0);
        importacao.vincular('dataVenda', 1);
      });
      it('deve validar o campo', function() {
        spyOn(campo, 'validar');
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/67/2018',
          'Price': '2299.99'
        }]);

        expect(campo.validar).toHaveBeenCalled();
      });
      it('deve atribuir status corretamente', function() {
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/67/2018',
          'Price': '2299.99'
        }]);

        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].possuiConflito).toBe(false);
      });
    });

    describe('- campo obrigatório, com vinculo (válido) -', function() {
      var campo, lote;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'dataVenda'});
        importacao = new Importacao([campo]);

        importacao.adicionarColuna('Date', 0);
        importacao.vincular('dataVenda', 1);
      });
      it('deve validar o campo', function() {
        spyOn(campo, 'validar');
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/07/2018',
          'Price': '2299.99'
        }]);

        expect(campo.validar).toHaveBeenCalled();
      });
      it('deve atribuir status corretamente', function() {
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/07/2018',
          'Price': '2299.99'
        }]);

        expect(lote.itens[0].possuiErro).toBe(false);
        expect(lote.itens[0].possuiConflito).toBe(false);
      });
    });

    describe('- campo não-obrigatório, com vinculo (inválido) -', function() {
      var campo, lote;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'dataVenda'});
        campo.obrigatorio = false;
        importacao = new Importacao([campo]);

        importacao.adicionarColuna('Date', 0);
        importacao.vincular('dataVenda', 1);
      });
      it('deve validar o campo', function() {
        spyOn(campo, 'validar');
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/67/2018',
          'Price': '2299.99'
        }]);

        expect(campo.validar).toHaveBeenCalled();
      });
      it('deve atribuir status corretamente', function() {
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/67/2018',
          'Price': '2299.99'
        }]);

        expect(lote.itens[0].possuiErro).toBe(false);
        expect(lote.itens[0].possuiConflito).toBe(true);
      });
    });

    describe('- campos não-obrigatório + obrigatório, com vinculos (inválidos) -', function() {
      var campo1, campo2, lote;
      beforeEach(function() {
        campo1 = _.find(camposMockVenda, {chave: 'dataVenda'});
        campo1.obrigatorio = true;
        campo2 = _.find(camposMockVenda, {chave: 'total'});
        campo2.obrigatorio = false;
        importacao = new Importacao([campo1, campo2]);

        importacao.adicionarColuna('Date', 0);
        importacao.adicionarColuna('Price', 1);
        importacao.vincular('dataVenda', 1);
        importacao.vincular('total', 2);
      });
      it('deve atribuir status corretamente', function() {
        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/67/2018',
          'Price': '2299:99',
          'Ps': 'teste'
        }]);

        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].possuiConflito).toBe(false); // Item possui conflito, mas, como tembém possui erro, o status de erro prevalece.
      });
    });

    describe('- campo obrigatório, com vinculo (inválido) - lote anterior item desconsiderado -', function() {
      var campo, lote, loteAnterior;
      beforeEach(function() {
        campo = _.find(camposMockVenda, {chave: 'dataVenda'});
        importacao = new Importacao([campo]);

        importacao.adicionarColuna('Date', 0);
        importacao.vincular('dataVenda', 1);

        loteAnterior = {itens: [{desconsiderado: true}]};

        lote = importacao.montarLote([{
          'Product': 'Notebook ABC Dell',
          'Date': '11/67/2018',
          'Price': '2299.99'
        }], loteAnterior);
      });
      it('deve atribuir status corretamente', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].possuiConflito).toBe(false);
      });
      it('deve configurar item desconsiderado', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].possuiConflito).toBe(false);
      });
    });

  });

});