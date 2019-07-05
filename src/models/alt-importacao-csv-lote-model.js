;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvLoteModel', [function() {
      class LoteImportacao {
        constructor(lote) {
          this.itens = [];
          this.processando = 0;
          this.validos = 0;
          this.erros = 0;
          this.conflitos = 0;
          this.nomeArquivo = '';
          this.quantidadeImportadosSucesso = 0;
          this.quantidadeImportadosAviso = 0;
          this.quantidadeErros = 0;

          ng.extend(this, lote);
        }
      }

      return LoteImportacao;
    }]);
}(angular));
