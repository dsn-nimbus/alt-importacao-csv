;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvResumoItemModel', [function() {
      class ResumoItemImportacao {
        constructor(linha) {
          this.linha = linha;
          this.status = '';
          this.campos = [];
          this.mensagens = [];
        }
      }

      return ResumoItemImportacao;
    }]);
}(angular));
