;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvCampoModel', [
      '$sce',
      '$filter',
      'moment',
      'latinize',
      function($sce, $filter, moment, latinize) {
      class CampoImportacao {
        constructor(e) {
          this.nome = '';
          this.chave = '';
          this.obrigatorio = false;
          this.dado = '';
          this.coluna = undefined;
          this.valor = undefined;
          this.referencia = undefined;
          this.valido = false;
          this.tipo = undefined;
          this.vinculoRequisitado = false;
          this.template = {};
          this.objetoChave = undefined;
          this.objetoListagem = undefined;
          this.objetoReferencia = undefined;
          this.objetoAutoVinculo = undefined;
          this.objetoCriarNovo = undefined;
          this.objetoOpcoesListagem = {};
          this.mensagens = [];
          this.tplProp = '';
          this.exibirNaVisualizacaoListaPosicao = 0; // 0 = não exibir

          ng.extend(this, e);

          this._parseObrigatorio();
          this._parseObjetoAutoVinculo();
          this._parseTipo();
          this._parseTemplate();
          this._validarOpcoes();
        }

        _validarOpcoes() {
          if (!this.nome) {
            throw new Error('Parametro "nome" é obrigatório.');
          }
          if (!this.chave) {
            throw new Error('Parametro "chave" é obrigatório.');
          }
          if (this.tipo === Object && !this.objetoChave) {
            throw new Error('Parametro "objetoChave" é obrigatório para campo Object.');
          }
          if (this.tipo === Object && !this.objetoReferencia) {
            throw new Error('Parametro "objetoReferencia" é obrigatório para campo Object.');
          }
          if (this.tipo === Object && !this.objetoListagem) {
            throw new Error('Parametro "objetoListagem" é obrigatório para campo Object.');
          }
        }

        _parseObrigatorio() {
          this.obrigatorio = !!this.obrigatorio;
        }

        _parseObjetoAutoVinculo() {
          if (this.tipo === Object && (!this.objetoAutoVinculo || typeof this.objetoAutoVinculo !== "function")) {
            this.objetoAutoVinculo = (valor) => {
              var obj = undefined;
              if (valor) {
                valor = latinize(valor.toLowerCase());
                this.objetoListagem().forEach((o) => {
                  if (latinize(o[this.objetoReferencia]).toLowerCase() === valor) {
                    obj = o;
                    return;
                  }
                });
              }
              return obj;
            };
          }
        }

        _parseTipo() {
          if (this.tipo !== Object && this.tipo !== Date && this.tipo !== Boolean && this.tipo !== Number) {
            this.tipo = String;
          }
        }

        _parseTemplate() {
          this.template = {
            width: typeof this.template.width === "number" ? this.template.width : 12,
            label: this.template.label ? this.template.label : this.nome
          };
        }

        _incluirMensagemValidacao(texto) {
          this.mensagens.push({
            textoHtml: $sce.trustAsHtml('O campo <u>' + this.template.label + '</u> ' + texto + '.')
          });
        }

        _validarObjeto() {
          if (this.regrasDeValor && this.regrasDeValor.length > 0) {
            var regra = _.find(this.regrasDeValor, {valor: this.dado});
            if (regra && regra.objeto) {
              this.valor = regra.objeto;
              this.referencia = regra.objeto[this.objetoReferencia];
            }
            else {
              var geral = _.find(this.regrasDeValor, {geral: true});
              if (geral && geral.objeto) {
                this.valor = geral.objeto;
                this.referencia = geral.objeto[this.objetoReferencia];
              }
              else {
                this._incluirMensagemValidacao(this.obrigatorio ? 'é obrigatório' : 'não possui regra');
              }
            }
          }
        }

        _validarData() {
          var m = moment(this.dado, 'DD/MM/YYYY');
          if (m.isValid()) {
            this.valor = m.toDate();
            this.referencia = m.format('DD/MM/YYYY');
          }
          else {
            this._incluirMensagemValidacao('não é uma data válida');
          }
        }

        _validarTexto() {
          if (typeof this.dado === "string" && this.dado.length <= 255) {
            this.valor = this.dado;
            this.referencia = this.valor;
          }
          else {
            this._incluirMensagemValidacao('não é um texto válido');
          }
        }

        _validarNumero() {
          this.dado = this.dado.toString().replace(',', '.');
          if ($.isNumeric(this.dado)) {
            this.valor = parseFloat(this.dado);
            this.referencia = this.monetario ? $filter('currency')(this.valor, 'R$ ') : this.valor;
          }
          else {
            this._incluirMensagemValidacao('não é um número válido');
          }
        }

        _validarBoleano() {
          var dado = latinize(this.dado.toString().toLowerCase());
          if (dado === '0' || dado === 'false' || dado === 'nao' || dado === 'n' || dado === 'f') {
            this.valor = false;
            this.referencia = 'Não';
          }
          else if (dado === '1' || dado === 'true' || dado === 'sim' || dado === 's' || dado === 'v') {
            this.valor = true;
            this.referencia = 'Sim';
          }
          else {
            this._incluirMensagemValidacao('não é um "verdadeiro ou falso" válido');
          }
        }

        validar() {
          this.valor = undefined;
          this.referencia = undefined;
          this.mensagens = [];
          if (!this.dado) {
            this.dado = '';
          }

          switch (this.tipo) {
            case Object: this._validarObjeto(); break;
            case Date: this._validarData(); break;
            case String: this._validarTexto(); break;
            case Number: this._validarNumero(); break;
            case Boolean: this._validarBoleano();
          }

          this.valido = this.valor !== undefined;
        }

        possuiRegraGeral() {
          var regra = _.find(this.regrasDeValor, {geral: true});
          return !!regra && !!regra.objeto;
        }

        possuiVinculoOuRegraGeral() {
          return !!this.coluna || this.possuiRegraGeral();
        }
      }

      return CampoImportacao;
    }]);
}(angular));
