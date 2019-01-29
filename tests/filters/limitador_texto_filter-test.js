/* eslint prefer-arrow-callback: "off", strict: "off", object-curly-spacing: "off" */

describe('LimitadorTexto', function () {

  var _LimitadorTexto;

  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function ($filter) {
      _LimitadorTexto = $filter('LimitadorTexto');
  }));

  afterEach(function () {
      _LimitadorTexto = null;
  });

  it('deve retornar undefined, nada passado', function () {
      expect(_LimitadorTexto()).toBeUndefined();
  });

  it('deve retornar apenas o primeiro nome, apenas uma palavra passada', function () {
      var _texto = 'Eric';

      expect(_LimitadorTexto(_texto)).toBe('Eric');
  });

  it('deve retornar as duas palavras', function () {
      var _texto = 'Eric Mendes';

      expect(_LimitadorTexto(_texto)).toBe('Eric Mendes');
  });

  it('deve retornar apenas a primeira e última palavra, três informadas - tamanho é 53', function () {
      var _texto = 'Eric Mendes Dantas';
      var _resposta = 'Eric Mendes Dantas';

      expect(_LimitadorTexto(_texto)).toBe(_resposta);
  });

  it('deve retornar apenas a primeira e última palavra, três informadas - tamanho é 5', function () {
      var _texto = 'Eric Mendes Dantas';
      var _resposta = 'Er...';

      expect(_LimitadorTexto(_texto, 5)).toBe(_resposta);
  });

  it('deve retornar apenas a primeira e última palavra, três informadas - tamanho é 53', function () {
      var _texto = 'Eric Mendes Dantas Da Silva Fulano Mais Alguma Coisa Dantas';
      var _resposta = 'Eric Mendes Dantas Da Silva Fulano Mais Alguma Coi...';

      expect(_LimitadorTexto(_texto)).toBe(_resposta);
  });

  it('deve retornar apenas a as palavras até 10 caracteres - tamanho máximo é 10', function () {
      var _texto = 'Eric Mendes Dantas Da Silva Fulano Mais Alguma Coisa Dantas';
      var _resposta = 'Eric Me...';

      expect(_LimitadorTexto(_texto, 10)).toBe(_resposta);
  });

});
