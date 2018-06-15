;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvLoteModel', [function() {
      class LoteImportacao {
        constructor() {
          this.itens = [];
          this.erros = 0;
          this.conflitos = 0;
          this.validos = 0;
        }

        resumir() {
          this.validos = 0;
          this.erros = 0;
          this.conflitos = 0;
          this.desconsiderados = 0;
          this.itens.forEach((item) => {
            if (item.possuiErro) {
              if (item.desconsiderado) {
                this.desconsiderados++;
              }
              else {
                this.erros++;
              }
            }
            else if (item.possuiConflito) {
              if (item.desconsiderado) {
                this.desconsiderados++;
              }
              else {
                this.conflitos++;
              }
            }
            else {
              if (item.desconsiderado) {
                this.desconsiderados++;
              }
              else {
                this.validos++;
              }
            }
          });
        }

        aplicarStatusErro(index) {
          var item = this.itens[index];
          item.objeto.invalido = true;
          item.possuiErro = true;
          item.possuiConflito = false;
          this.resumir();
        }

        aplicarStatusAlerta(index) {
          var item = this.itens[index];
          if (!item.possuiErro) {
            item.possuiConflito = true;
          }
          this.resumir();
        }

        desconsiderarItem(index) {
          var item = this.itens[index];
          item.desconsiderado = true;
          this.resumir();
        }

        considerarItem(index) {
          var item = this.itens[index];
          item.desconsiderado = false;
          this.resumir();
        }

      }

      return LoteImportacao;
    }]);
}(angular));
