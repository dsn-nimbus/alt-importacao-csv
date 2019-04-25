;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvOpcoesModel', ['$q', function($q) {
      class OpcoesImportacao {
        constructor(obj) {
          this.labelTipo = '';
          this.labelTipoSingular = '';
          this.eventoCriacao = '';
          this.campos = undefined;
          this.validarLote = undefined;
          this.gravarLote = undefined;
          this.visualizacao = false;
          this.loteProcessado = undefined;
          this.titulosMensagensCustomizadas = [];
          this.obterItensNaoImportados = () => $q.resolve([]);
          this.obterItensImportadosComAviso = () => $q.resolve([]);

          ng.extend(this, obj);

          this._parseVisualizacao();
          this._validarOpcoes();
        }

        _parseVisualizacao() {
          this.visualizacao = !!this.visualizacao;
        }

        _validarOpcoes() {
          if (!this.labelTipo) {
            throw new Error('Parametro "labelTipo" é obrigatório.');
          }
          if (!this.campos) {
            throw new Error('Parametro "campos" é obrigatório.');
          }
          if (this.visualizacao) {
            if (!this.labelTipoSingular) {
              throw new Error('Parametro "labelTipoSingular" é obrigatório quando em visualização.');
            }
            if (!this.loteProcessado) {
              throw new Error('Parametro "loteProcessado" é obrigatório quando em visualização.');
            }
          }
          else {
            if (!this.eventoCriacao) {
              throw new Error('Parametro "eventoCriacao" é obrigatório quando em importação.');
            }
            if (!this.validarLote) {
              throw new Error('Parametro "validarLote" é obrigatório quando em importação.');
            }
            if (!this.gravarLote) {
              throw new Error('Parametro "gravarLote" é obrigatório quando em importação.');
            }
          }
        }

        obterTitulosMensagensPorStep (step) {
          if (!this.titulosMensagensCustomizadas || !this.titulosMensagensCustomizadas.length) {
            return null;
          }

          let _retorno = this.titulosMensagensCustomizadas.filter((item) => {
            return item.step === step;
          });

          if (!!_retorno && !!_retorno.length) {
            return _retorno[0];
          }

          return null;
        }

      }

      return OpcoesImportacao;
    }]);
}(angular));
