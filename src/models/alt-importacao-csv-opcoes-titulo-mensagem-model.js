;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvOpcoesTituloMensagemModel', [function() {
      class OpcoesTituloMensagemModel {
        constructor(step, title, message) {
          this.step = step;
          this.title = title;
          this.message = message;
        }
      }

      return OpcoesTituloMensagemModel;
    }]);
}(angular));
