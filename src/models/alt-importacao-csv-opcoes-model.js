;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvOpcoesModel', [function() {
      class OpcoesImportacao {
        constructor(obj) {
          this.labelTipo = '';
          this.eventoCriacao = '';
          this.campos = [];
          this.validarLote = undefined;
          this.gravarLote = undefined;

          ng.extend(this, obj);
        }
      }

      return OpcoesImportacao;
    }]);
}(angular));
