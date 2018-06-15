'use strict';

describe('ItemImportacao', function() {
  var ItemImportacao, ResumoItemImportacao, LoteImportacao;
  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    ItemImportacao = $injector.get('AltImportacaoCsvItemModel');
    ResumoItemImportacao = $injector.get('AltImportacaoCsvResumoItemModel');
    LoteImportacao = $injector.get('AltImportacaoCsvLoteModel');
  }));

  describe('constructor', function() {
    it('deve ter valores corretos para instancia vazia', function() {
      var item = new ItemImportacao();
      expect(item.objeto).toEqual({});
      expect(item.resumo).toEqual(new ResumoItemImportacao());
      expect(item.desconsiderado).toBeFalsy();
      expect(item.possuiErro).toBeFalsy();
      expect(item.possuiConflito).toBeFalsy();
    });
    it('deve ter valores corretos para instancia com parametro das linha', function() {
      var item = new ItemImportacao(88);
      expect(item.objeto).toEqual({});
      expect(item.resumo).toEqual(new ResumoItemImportacao(88));
      expect(item.desconsiderado).toBeFalsy();
      expect(item.possuiErro).toBeFalsy();
      expect(item.possuiConflito).toBeFalsy();
    });
  });
  // describe('aplicarStatusErro(lote)', function() {
  //   var lote;
  //   describe('- lote vazio -', function() {
  //     beforeEach(function() {
  //       lote = new LoteImportacao();
  //       lote.itens.push(new ItemImportacao(65));
  //       lote.resumir();
  //       lote.aplicarStatusErro(0);
  //     });
  //     it('deve configurar item com erro', function() {
  //       expect(lote.itens[0].possuiErro).toBeTruthy();
  //       expect(lote.itens[0].resumo.status).toBe('error');
  //       expect(lote.itens[0].objeto.invalido).toBeTruthy();
  //     });
  //   });

  //   describe('- lote com warning -', function() {
  //     beforeEach(function() {
  //       lote = new LoteImportacao();
  //       lote.itens.push(new ItemImportacao(65));
  //       lote.possuiConflito = true;
  //       lote.conflitos = 1;
  //       lote.resumir();

  //       lote.itens[0].aplicarStatusErro(lote);
  //     });
  //     it('deve corrigir contagem', function() {
  //       expect(lote.conflitos).toBe(0);
  //       expect(lote.erros).toBe(1);
  //     });
  //     it('deve corrigir flag de conflito', function() {
  //       expect(lote.possuiConflito).toBe(false);
  //     });
  //     it('deve configurar item com erro', function() {
  //       expect(lote.itens[0].possuiErro).toBeTruthy();
  //       expect(lote.itens[0].resumo.status).toBe('error');
  //       expect(lote.itens[0].objeto.invalido).toBeTruthy();
  //     });
  //   });

    /**
     * TODO 06/06/2018 continuar... aplicarStatusErro() com outros tipos de lote.
     * 
     * 
     * 
     * 
     */

  // });
});