;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvLoteModel', [function() {
      class LoteImportacao {
        constructor(lote) {
          this.itens = [];
          this.erros = 0;
          this.conflitos = 0;
          this.validos = 0;
          this.nomeArquivo = '';

          ng.extend(this, lote);
        }

        resumir() {
          this.processando = 0;
          this.validos = 0;
          this.erros = 0;

          this.itens.forEach((item) => {
            if (item.status === 2) {
              this.erros++;
            } else if (item.status === 1) {
              this.validos++;
            }
            else {
              this.processando++;
            }
          });
        }
      }

      return LoteImportacao;
    }]);
}(angular));
