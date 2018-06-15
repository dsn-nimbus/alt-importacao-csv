'use strict';

describe('OpcoesImportacao', function() {
  var OpcoesImportacao;
  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    OpcoesImportacao = $injector.get('AltImportacaoCsvOpcoesModel');
  }));

  describe('constructor', function() {
    it('deve ter valores corretos para instancia vazia', function() {
      var obj = new OpcoesImportacao();
      expect(obj.labelTipo).toBe('');
      expect(obj.eventoCriacao).toBe('');
      expect(obj.campos.constructor === Array).toBeTruthy();
      expect(obj.campos.length === 0).toBeTruthy();
      expect(obj.validarLote).toBeUndefined();
      expect(obj.gravarLote).toBeUndefined();
    });
    it('deve extender objeto com parametos', function() {
      var params = {
        labelTipo: 'teste',
        eventoCriacao: 'teste:objeto_criado',
        campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
        validarLote: () => {return new Promise((lote) => {return lote});},
        gravarLote: () => {return new Promise((lote) => {return {}});}
      };
      var obj = new OpcoesImportacao(params);
      expect(obj.labelTipo).toEqual(params.labelTipo);
      expect(obj.eventoCriacao).toEqual(params.eventoCriacao);
      expect(obj.campos).toEqual(params.campos);
      expect(obj.validarLote).toEqual(params.validarLote);
      expect(obj.gravarLote).toEqual(params.gravarLote);
    });
  });
});