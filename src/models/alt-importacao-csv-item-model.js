;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvItemModel', ['AltImportacaoCsvResumoItemModel', function(ResumoItemImportacao) {
      class ItemImportacao {
        constructor(linha) {
          this.objeto = {};
          this.resumo = new ResumoItemImportacao(linha);
          this.desconsiderado = false;
          this.possuiErro = false;
          this.possuiConflito = false;
        }
      }

      return ItemImportacao;
    }]);
}(angular));
