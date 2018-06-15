'use strict';

describe('altImportacaoCsvLeitor', function() {
  var _compile, _rootScope, _scope, _element;

  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    _rootScope = $injector.get('$rootScope');
    _scope = _rootScope.$new();
    _compile = $injector.get('$compile');
  }));

  var _criarElemento = function() {
    var html = 
    // '<div>' + 
      '<input type="file" ng-model="arquivo" '+
      'id="leitor-teste" alt-importacao-csv-leitor ' +
      'onchange="console.log(\'changed!\')" value="C:\\fakepath\\test-file.xlsx"/>';
    // '</div>';
    _element = angular.element(html);
    _compile(_element)(_scope);

    _scope.fileChanged = function(files) {
      return files[0].length < 500000;
    }
    _scope.$digest();
  };

  describe('criação', function() {
    it('deve definir o elemento sem erro', function() {
      _criarElemento();
      expect(true).toBe(true);
    });
  });

  describe('change', function() {
    beforeEach(function() {
      _criarElemento();
    });
    describe('- arquivo inválido -', function() {
      beforeEach(function(){
        var file = new File([new ArrayBuffer(2e+5)], 'C:\\fakepath\\test-file.xlsx', { lastModified: null, type: 'xlsx' });
        _element.triggerHandler({
          type: 'change',
          target: {
            files: [file]
          },
        });
        _scope.$digest();
      });
      it('deve configurar arquivo como inválido!', function(done) {
        setTimeout(() => {
          expect(_scope.arquivo.valido).toBe(false);
          expect(_scope.arquivo.mensagem).toBe('Tipo de arquivo inválido.');
          done();
        }, 100);
      });
    });
  });
});