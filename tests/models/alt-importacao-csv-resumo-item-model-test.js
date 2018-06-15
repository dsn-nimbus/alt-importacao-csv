'use strict';

describe('ResumoItemImportacao', function() {
  var ResumoItemImportacao;
  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    ResumoItemImportacao = $injector.get('AltImportacaoCsvResumoItemModel');
  }));

  describe('constructor', function() {
    var obj;
    var linha = 44;
    beforeEach(function() {
      obj = new ResumoItemImportacao(linha);
    });
    it('deve inicializar propriedades da classe', function() {
      expect(obj.linha).toBe(linha);
      expect(obj.status).toBe('');
      expect(obj.campos.constructor === Array).toBeTruthy();
      expect(obj.campos.length === 0).toBeTruthy();
      expect(obj.mensagens.constructor === Array).toBeTruthy();
      expect(obj.mensagens.length === 0).toBeTruthy();
    });
  });
});