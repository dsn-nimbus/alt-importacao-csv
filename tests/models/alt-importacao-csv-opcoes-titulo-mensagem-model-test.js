'use strict';

describe('AltImportacaoCsvOpcoesTituloMensagemModel', function() {
  var OpcoesTituloMensagemModel;
  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    OpcoesTituloMensagemModel = $injector.get('AltImportacaoCsvOpcoesTituloMensagemModel');
  }));

  describe('constructor', function() {
    var obj;
    beforeEach(function() {
      obj = new OpcoesTituloMensagemModel(1, 'titulo', 'abc');
    });
    it('deve inicializar propriedades da classe', function() {
      expect(obj instanceof OpcoesTituloMensagemModel).toBe(true);
      expect(obj.step).toBe(1);
      expect(obj.title).toBe('titulo');
      expect(obj.message).toBe('abc');
    });
  });
});