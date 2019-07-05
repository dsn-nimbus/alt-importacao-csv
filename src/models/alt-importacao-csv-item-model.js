;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvItemModel', ['AltImportacaoCsvResumoItemModel', function(ResumoItemImportacao) {
      class ItemImportacao {
        constructor(linha, objeto) {
          this.linha = linha;
          this.objeto = objeto;
        }
      }

      return ItemImportacao;
    }]);
}(angular));
