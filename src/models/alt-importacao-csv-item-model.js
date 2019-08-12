;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvItemModel', ['AltImportacaoCsvResumoItemModel', function(ResumoItemImportacao) {
      class ItemImportacao {
        constructor(linha, objeto, teste) {
          this.linha = linha;
          this.objeto = objeto; // Obs: teste
          this.teste = teste;
        }
      }

      return ItemImportacao;
    }]);
}(angular));
