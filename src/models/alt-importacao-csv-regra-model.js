; (function (ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvRegraModel', [function () {
      class RegraImportacao {
        constructor(obj) {
          this.valor = '';
          this.geral = false;
          this.quantidade = 0;
          this.objeto = null;
          this.autoVinculoAplicado = false;
          this.obrigatoria = () => false;

          ng.extend(this, obj);
        }
      }

      return RegraImportacao;
    }]);
}(angular));