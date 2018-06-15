'use strict';

describe('LoteImportacao', function() {
  var LoteImportacao, ItemImportacao;

  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    LoteImportacao = $injector.get('AltImportacaoCsvLoteModel');
    ItemImportacao = $injector.get('AltImportacaoCsvItemModel');
  }));

  describe('constructor', function() {
    it('deve ter valores corretos para instancia vazia', function() {
      var obj = new LoteImportacao();
      expect(obj.itens.constructor === Array).toBe(true);
      expect(obj.itens.length).toBe(0);
      expect(obj.erros).toBe(0);
      expect(obj.conflitos).toBe(0);
      expect(obj.validos).toBe(0);
    });
  });

  describe('aplicarStatusErro(index)', function() {
    var lote;
    describe('- item válido -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.resumir();
        lote.aplicarStatusErro(0);
      });
      it('deve configurar item com erro', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].objeto.invalido).toBe(true);
      });
      it('deve corrigir totais', function() {
        expect(lote.validos).toBe(0);
        expect(lote.erros).toBe(1);
      });
    });
    describe('- item válido desconsiderado -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.aplicarStatusErro(0);
      });
      it('deve configurar item com erro', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].objeto.invalido).toBe(true);
      });
      it('não deve corrigir totais', function() {
        expect(lote.validos).toBe(0);
        expect(lote.erros).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
    });
    describe('- item com conflito -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiConflito = true;
        lote.resumir();
        lote.aplicarStatusErro(0);
      });
      it('deve configurar item com erro', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].objeto.invalido).toBe(true);
      });
      it('deve remover status conflito', function() {
        expect(lote.itens[0].possuiConflito).toBe(false);
      });
      it('deve corrigir totais', function() {
        expect(lote.conflitos).toBe(0);
        expect(lote.erros).toBe(1);
      });
    });
    describe('- item com conflito (desconsiderado) -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiConflito = true;
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.aplicarStatusErro(0);
      });
      it('deve configurar item com erro', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].objeto.invalido).toBe(true);
      });
      it('deve remover status conflito', function() {
        expect(lote.itens[0].possuiConflito).toBe(false);
      });
      it('não deve corrigir totais', function() {
        expect(lote.conflitos).toBe(0);
        expect(lote.erros).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
    });
    describe('- item já com erro -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiErro = true;
        lote.resumir();
        lote.aplicarStatusErro(0);
      });
      it('deve configurar item com erro', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
        expect(lote.itens[0].objeto.invalido).toBe(true);
      });
      it('deve mater totais', function() {
        expect(lote.erros).toBe(1);
      });
    });
  });

  describe('aplicarStatusAlerta(index)', function() {
    var lote;
    describe('- item válido -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.resumir();
        lote.aplicarStatusAlerta(0);
      });
      it('deve configurar item com conflito', function() {
        expect(lote.itens[0].possuiConflito).toBe(true);
      });
      it('deve corrigir totais', function() {
        expect(lote.validos).toBe(0);
        expect(lote.conflitos).toBe(1);
      });
    });
    describe('- item válido desconsiderado -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.aplicarStatusAlerta(0);
      });
      it('deve configurar item com conflito', function() {
        expect(lote.itens[0].possuiConflito).toBe(true);
      });
      it('não deve corrigir totais', function() {
        expect(lote.validos).toBe(0);
        expect(lote.conflitos).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
    });
    describe('- item com erro -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiErro = true;
        lote.resumir();
        lote.aplicarStatusAlerta(0);
      });
      it('deve manter item com erro', function() {
        expect(lote.itens[0].possuiErro).toBe(true);
      });
      it('deve manter totais', function() {
        expect(lote.erros).toBe(1);
        expect(lote.conflitos).toBe(0);
      });
    });
    describe('- item já com conflito -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiConflito = true;
        lote.resumir();
        lote.aplicarStatusAlerta(0);
      });
      it('deve manter item com conflito', function() {
        expect(lote.itens[0].possuiConflito).toBe(true);
      });
      it('deve manter totais', function() {
        expect(lote.conflitos).toBe(1);
      });
    });
  });

  describe('desconsiderarItem(index)', function() {
    var lote;
    describe('- item válido -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.resumir();
        lote.desconsiderarItem(0);
      });
      it('deve desconsiderar o item', function() {
        expect(lote.itens[0].desconsiderado).toBe(true);
      });
      it('deve atualizar totais', function() {
        expect(lote.validos).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
    });
    describe('- item com erro -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiErro = true;
        lote.resumir();
        lote.desconsiderarItem(0);
      });
      it('deve desconsiderar o item', function() {
        expect(lote.itens[0].desconsiderado).toBe(true);
      });
      it('deve atualizar totais', function() {
        expect(lote.erros).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
    });
    describe('- item com conflito -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiConflito = true;
        lote.resumir();
        lote.desconsiderarItem(0);
      });
      it('deve desconsiderar o item', function() {
        expect(lote.itens[0].desconsiderado).toBe(true);
      });
      it('deve atualizar totais', function() {
        expect(lote.conflitos).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
    });
  });

  describe('considerarItem(index)', function() {
    var lote;
    describe('- item válido -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.considerarItem(0);
      });
      it('deve considerar o item', function() {
        expect(lote.itens[0].desconsiderado).toBe(false);
      });
      it('deve atualizar totais', function() {
        expect(lote.validos).toBe(1);
        expect(lote.desconsiderados).toBe(0);
      });
    });
    describe('- item com erro -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiErro = true;
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.considerarItem(0);
      });
      it('deve considerar o item', function() {
        expect(lote.itens[0].desconsiderado).toBe(false);
      });
      it('deve atualizar totais', function() {
        expect(lote.erros).toBe(1);
        expect(lote.desconsiderados).toBe(0);
      });
    });
    describe('- item com conflito -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens[0].possuiConflito = true;
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.considerarItem(0);
      });
      it('deve considerar o item', function() {
        expect(lote.itens[0].desconsiderado).toBe(false);
      });
      it('deve atualizar totais', function() {
        expect(lote.conflitos).toBe(1);
        expect(lote.desconsiderados).toBe(0);
      });
    });
  });

  describe('resumir()', function() {
    var lote;
    describe('- itens válidos -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.validos).toBe(3);
      });
    });
    describe('- itens com erro -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens[0].possuiErro = true;
        lote.itens[1].possuiErro = true;
        lote.itens[2].possuiErro = true;
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.erros).toBe(3);
      });
    });
    describe('- itens com conflito -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens[0].possuiConflito = true;
        lote.itens[1].possuiConflito = true;
        lote.itens[2].possuiConflito = true;
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.conflitos).toBe(3);
      });
    });
    describe('- itens variados -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens.push(new ItemImportacao(68));
        lote.itens[0].possuiConflito = true;
        lote.itens[1].possuiConflito = true;
        lote.itens[2].possuiErro = true;
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.conflitos).toBe(2);
        expect(lote.erros).toBe(1);
        expect(lote.validos).toBe(1);
      });
    });
    describe('- itens variados (erro desconsiderado) -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens.push(new ItemImportacao(68));
        lote.itens[0].possuiConflito = true;
        lote.itens[1].possuiConflito = true;
        lote.itens[2].possuiErro = true;
        lote.resumir();
        lote.desconsiderarItem(2);
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.conflitos).toBe(2);
        expect(lote.validos).toBe(1);
        expect(lote.erros).toBe(0);
        expect(lote.desconsiderados).toBe(1);
      });
      it('deve manter status erro no item desconsiderado', function() {
        expect(lote.itens[2].possuiErro).toBe(true);
      });
    });
    describe('- itens variados (conflito desconsiderado) -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens.push(new ItemImportacao(68));
        lote.itens[0].possuiConflito = true;
        lote.itens[1].possuiConflito = true;
        lote.itens[2].possuiErro = true;
        lote.resumir();
        lote.desconsiderarItem(0);
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.conflitos).toBe(1);
        expect(lote.validos).toBe(1);
        expect(lote.erros).toBe(1);
        expect(lote.desconsiderados).toBe(1);
      });
      it('deve manter status erro no item desconsiderado', function() {
        expect(lote.itens[0].possuiConflito).toBe(true);
      });
    });
    describe('- itens variados (válido desconsiderado) -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens.push(new ItemImportacao(68));
        lote.itens[0].possuiConflito = true;
        lote.itens[1].possuiConflito = true;
        lote.itens[2].possuiErro = true;
        lote.resumir();
        lote.desconsiderarItem(3);
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.conflitos).toBe(2);
        expect(lote.validos).toBe(0);
        expect(lote.erros).toBe(1);
        expect(lote.desconsiderados).toBe(1);
      });
    });
  });

});