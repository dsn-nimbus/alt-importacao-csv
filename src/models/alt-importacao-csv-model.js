;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
  .factory('AltImportacaoCsvModel', [
    '$sce',
    '$q',
    'AltImportacaoCsvItemModel',
    'AltImportacaoCsvLoteModel',
    '_',
    function($sce, $q, ItemImportacao, LoteImportacao, _) {
      class Importacao {
        constructor(campos) {
          this.campos = campos;

          this.colunas = [];
          this.mapaInvalido = false;
        }

        validarMapa() {
          this.mapaInvalido = false;
          this.campos.forEach((campo) => {
            if (campo.tipo === Object) {
              return;
            }
            if (campo.obrigatorio && !campo.coluna) {
              campo.vinculoRequisitado = true;
              this.mapaInvalido = true;
            }
            else {
              campo.vinculoRequisitado = false;
            }
          });
        }

        adicionarColuna(nome, index) {
          this.colunas.push({
            nome: nome,
            numero: index + 1,
            titulo: 'Coluna ' + (index + 1) + ' – ' + nome,
            campos: []
          });
        }

        vincular(chaveCampo, numeroColuna) {
          var campo = _.find(this.campos, {chave: chaveCampo});
          var coluna = _.find(this.colunas, {numero: numeroColuna});
          if (!!campo && !!coluna) {
            campo.coluna = numeroColuna;
            coluna.campos.push(campo);
            this.validarMapa();
          }
        }

        desvincular(chaveCampo) {
          var campo = _.find(this.campos, {chave: chaveCampo});
          var coluna = _.find(this.colunas, {numero: campo.coluna});
          if (!!campo && !!coluna) {
            _.remove(coluna.campos, {chave: campo.chave});
            campo.coluna = undefined;
            campo.regrasDeValor = undefined;
            this.validarMapa();
          }
        }

        aplicarRegrasDeValor(linhas) {
          this.campos.forEach((campo) => {
            if (campo.tipo !== Object) {
              return;
            }
            if (!!campo.coluna) {
              var coluna = _.find(this.colunas, {numero: campo.coluna});
              var distinct = _.groupBy(linhas, (r) => { return r[coluna.nome]; });
              campo.regrasDeValor = Object.keys(distinct).map((key) => {
                return {
                  valor: key === 'undefined' ? '' : key,
                  quantidade: distinct[key].length,
                  objeto: campo.objetoAutoVinculo(key)
                };
              });
            }
            else {
              campo.regrasDeValor = [{
                valor: null,
                geral: true,
                quantidade: linhas.length,
                objeto: null
              }];
            };

            if (campo.objetoRegrasDeValor) {
              campo.objetoRegrasDeValor(this.campos);
            }
          });

          return this.resumirRegrasDeValor();
        }

        resumirRegrasDeValor() {
          var valores = 0;
          var vinculados = 0;
          var nulosValidos = 0;
          var nulosInvalidos = 0;
          this.campos.forEach((campo) => {
            if (campo.tipo !== Object) {
              return;
            }
            if (!campo.coluna) {
              var possuiRegra = !!campo.regrasDeValor[0].objeto;
              campo.resumoRegrasDeValor = {
                valores: 1,
                vinculados: possuiRegra ? 1 : 0,
                nulosValidos: !possuiRegra && !campo.obrigatorio ? 1 : 0,
                nulosInvalidos: !possuiRegra && campo.obrigatorio ? 1 : 0
              };
            }
            else {
              campo.resumoRegrasDeValor = {
                valores: 0,
                vinculados: 0,
                nulosValidos: 0,
                nulosInvalidos: 0
              };
              campo.regrasDeValor.forEach((regra) => {
                if (!regra.objeto && campo.obrigatorio) {
                  campo.resumoRegrasDeValor.nulosInvalidos++;
                }
                else if (!regra.objeto) {
                  campo.resumoRegrasDeValor.nulosValidos++;
                }
                else {
                  campo.resumoRegrasDeValor.vinculados++;
                }
                campo.resumoRegrasDeValor.valores++;
              });
            }

            valores += campo.resumoRegrasDeValor.valores;
            vinculados += campo.resumoRegrasDeValor.vinculados;
            nulosValidos += campo.resumoRegrasDeValor.nulosValidos;
            nulosInvalidos += campo.resumoRegrasDeValor.nulosInvalidos;
          });

          return {
            valores: valores,
            vinculados: vinculados,
            nulosValidos: nulosValidos,
            nulosInvalidos: nulosInvalidos
          };
        }

        montarLote(linhas, nomeArquivo, loteAnterior) {
          var lote = {
            nomeArquivo: nomeArquivo
          };

          lote = new LoteImportacao(lote);

          linhas.forEach((r, i) => {
            var linha = i + 2;
            var item = new ItemImportacao(linha);

            this.campos.forEach((campo) => {
              if (!campo.possuiVinculoOuRegraGeral() && !campo.obrigatorio) {
                return;
              }

              campo.dado = undefined;
              if (!!campo.coluna) {
                var coluna = _.find(this.colunas, {numero: campo.coluna});
                campo.dado = r[coluna.nome];
              }

              campo.validar();

              if (!campo.valido) {
                if (campo.obrigatorio) {
                  item.objeto.invalido = true;
                  item.possuiErro = true;
                  item.possuiConflito = false;
                }
                else if (!item.possuiErro) {
                  /*
                    Campos "inválidos não-obrigatórios" configuram um item conflituoso se, e somente se, não haja
                    erro em outro campo do item previamente verificado. Uma vez que se ao menos um campo do
                    item estiver com erro o item inteiro estará com erro, mesmo que possua campos "inválidos não-obrigatórios".
                  */
                  item.possuiConflito = true;
                }
              }

              campo.mensagens.forEach((msg) => {
                item.resumo.mensagens.push(msg);
              });

              item.objeto[campo.chave] = campo.valor;
              item.resumo.campos.push({
                valido: campo.valido,
                chave: campo.chave,
                dado: campo.dado,
                referencia: campo.referencia,
                template: ng.copy(campo.template)
              });
            });

            if (!!loteAnterior && loteAnterior.itens[i].desconsiderado === true) {
              item.desconsiderado = true;
            }

            lote.itens.push(item);
          });

          lote.resumir();

          return lote;
        }

      }

      return Importacao;
    }
  ]);
}(angular));
