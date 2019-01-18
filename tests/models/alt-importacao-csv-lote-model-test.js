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
        expect(lote.processando).toBe(3);
      });
    });
    describe('- itens com erro -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens[0].status = 2;
        lote.itens[1].status = 2;
        lote.itens[2].status = 2;
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.erros).toBe(3);
      });
    });
    describe('- itens variados -', function() {
      beforeAll(function() {
        lote = new LoteImportacao();
        lote.itens.push(new ItemImportacao(65));
        lote.itens.push(new ItemImportacao(66));
        lote.itens.push(new ItemImportacao(67));
        lote.itens.push(new ItemImportacao(68));
        lote.itens[0].status = 0;
        lote.itens[1].status = 1;
        lote.itens[2].status = 2;
        lote.resumir();
      });
      it('deve totalizar corretamente', function() {
        expect(lote.processando).toBe(2);
        expect(lote.erros).toBe(1);
        expect(lote.validos).toBe(1);
      });
    });
  });

});