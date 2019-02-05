'use strict';

describe('OpcoesImportacao', function() {
  var OpcoesImportacao;
  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    OpcoesImportacao = $injector.get('AltImportacaoCsvOpcoesModel');
  }));

  describe('constructor', function() {
    var params;
    it('deve lançar erro na falta do parametro labelTipo', function() {
      params = {
      };
      expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "labelTipo" é obrigatório.');
    });
    it('deve lançar erro na falta do parametro campos', function() {
      params = {
        labelTipo: 'teste',
        eventoCriacao: 'teste:objeto_criado',
        validarLote: () => {return new Promise((lote) => {return lote});},
        gravarLote: () => {return new Promise((lote) => {return {}});}
      };
      expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "campos" é obrigatório.');
    });
    describe('- importação -', function() {
      it('deve lançar erro na falta do parametro eventoCriacao', function() {
        params = {
          labelTipo: 'teste',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
          validarLote: () => {return new Promise((lote) => {return lote});},
          gravarLote: () => {return new Promise((lote) => {return {}});}
        };
        expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "eventoCriacao" é obrigatório quando em importação.');
      });
      it('deve lançar erro na falta do parametro validarLote', function() {
        params = {
          labelTipo: 'teste',
          eventoCriacao: 'teste:objeto_criado',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
          gravarLote: () => {return new Promise((lote) => {return {}});}
        };
        expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "validarLote" é obrigatório quando em importação.');
      });
      it('deve lançar erro na falta do parametro gravarLote', function() {
        params = {
          labelTipo: 'teste',
          eventoCriacao: 'teste:objeto_criado',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
          validarLote: () => {return new Promise((lote) => {return lote});}
        };
        expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "gravarLote" é obrigatório quando em importação.');
      });
      it('deve extender objeto com parametos corretos', function() {
        params = {
          labelTipo: 'teste',
          eventoCriacao: 'teste:objeto_criado',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
          validarLote: () => {return new Promise((lote) => {return lote});},
          gravarLote: () => {return new Promise((lote) => {return {}});},
          titulosMensagensCustomizadas: [{step: 1, title: 'a', message: 'abc'}]
        };
        var obj = new OpcoesImportacao(params);
        expect(obj.labelTipo).toEqual(params.labelTipo);
        expect(obj.eventoCriacao).toEqual(params.eventoCriacao);
        expect(obj.campos).toEqual(params.campos);
        expect(obj.validarLote).toEqual(params.validarLote);
        expect(obj.gravarLote).toEqual(params.gravarLote);
        expect(obj.titulosMensagensCustomizadas).toEqual(params.titulosMensagensCustomizadas);
      });
    });
    describe('- visualização -', function() {
      it('deve lançar erro na falta do parametro labelTipoSingular', function() {
        params = {
          labelTipo: 'vendas',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
          visualizacao: true,
          loteProcessado: [{}, {}]
        };
        expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "labelTipoSingular" é obrigatório quando em visualização.');
      });
      it('deve lançar erro na falta do parametro loteProcessado', function() {
        params = {
          labelTipo: 'vendas',
          labelTipoSingular: 'venda',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo:- Number}],
          visualizacao: true
        };
        expect(() => {new OpcoesImportacao(params);}).toThrowError('Parametro "loteProcessado" é obrigatório quando em visualização.');
      });
      it('deve extender objeto com parametos corretos', function() {
        params = {
          labelTipo: 'vendas',
          labelTipoSingular: 'venda',
          campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
          visualizacao: true,
          loteProcessado: [{}, {}]
        };
        var obj = new OpcoesImportacao(params);
        expect(obj.labelTipo).toEqual(params.labelTipo);
        expect(obj.labelTipoSingular).toEqual(params.labelTipoSingular);
        expect(obj.campos).toEqual(params.campos);
        expect(obj.loteProcessado).toEqual(params.loteProcessado);
      });
    });
    
  });

  describe('obterTitulosMensagensPorStep', () => {
    it('deve obter null, nenhum titulo/mensagem informados', () => {
      var params = {
        labelTipo: 'teste',
        eventoCriacao: 'teste:objeto_criado',
        campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
        validarLote: () => {return new Promise((lote) => {return lote});},
        gravarLote: () => {return new Promise((lote) => {return {}});},
      };
      var obj = new OpcoesImportacao(params);

      expect(obj.obterTitulosMensagensPorStep(1)).toBeNull();
      
    });

    it('deve obter null, step informado é inexistente', () => {
      var params = {
        labelTipo: 'teste',
        eventoCriacao: 'teste:objeto_criado',
        campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
        validarLote: () => {return new Promise((lote) => {return lote});},
        gravarLote: () => {return new Promise((lote) => {return {}});},
        titulosMensagensCustomizadas: [{step: 1, title: 'a', message: 'abc'}]
      };
      var obj = new OpcoesImportacao(params);
      
      expect(obj.obterTitulosMensagensPorStep(10)).toBeNull();
    });

    it('deve obter title/mensagem, step informado é válido', () => {
      var params = {
        labelTipo: 'teste',
        eventoCriacao: 'teste:objeto_criado',
        campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
        validarLote: () => {return new Promise((lote) => {return lote});},
        gravarLote: () => {return new Promise((lote) => {return {}});},
        titulosMensagensCustomizadas: [
          {step: 1, title: 'a', message: 'abc'},
          {step: 2, title: 'ab', message: 'abcd'}
        ]
      };
      var obj = new OpcoesImportacao(params);

      expect(obj.obterTitulosMensagensPorStep(1)).toEqual({step: 1, title: 'a', message: 'abc'});
    });

    it('deve obter o primeiro resultado de title/mensagem, existe mais de um step informado na lista', () => {
      var params = {
        labelTipo: 'teste',
        eventoCriacao: 'teste:objeto_criado',
        campos: [{nome: 'Prop1', chave: 'prop1', tipo: Number}],
        validarLote: () => {return new Promise((lote) => {return lote});},
        gravarLote: () => {return new Promise((lote) => {return {}});},
        titulosMensagensCustomizadas: [
          {step: 1, title: 'a', message: 'abc'},
          {step: 1, title: 'ab', message: 'abcd'}
        ]
      };
      var obj = new OpcoesImportacao(params);

      expect(obj.obterTitulosMensagensPorStep(1)).toEqual({step: 1, title: 'a', message: 'abc'});
    });
  });
});
