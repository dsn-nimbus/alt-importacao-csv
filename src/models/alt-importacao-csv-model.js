;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
  .factory('AltImportacaoCsvModel', [
    '$q',
    '$sce',
    'AltImportacaoCsvItemModel',
    'AltImportacaoCsvLoteModel',
    'AltImportacaoCsvRegraModel',
    '_',
    function($q, $sce, ItemImportacao, LoteImportacao, RegraImportacao, _) {
      class Importacao {
        constructor(campos, validacaoEspecifica) {
          this.campos = campos;

          this.colunas = [];
          this.mapaInvalido = false;
          this.mensagensMapa = [];
          this.validacaoEspecifica = angular.noop;

          if (typeof validacaoEspecifica === 'function') {
            this.validacaoEspecifica = validacaoEspecifica;
          }
        }

        validarMapa() {
          this.mapaInvalido = false;
          this.mensagensMapa = [];

          this.campos.forEach((campo) => {
            if (campo.tipo === Object) {
              return;
            }
            if (campo.obrigatorio && !campo.coluna) {
              this.mapaInvalido = true;
              this.mensagensMapa.push($sce.trustAsHtml(`O campo <b>${campo.nome}</b> deve ser vinculado a uma coluna do arquivo.`));
            }
          });

          var erros = this.validacaoEspecifica(this.campos);
          if (Array.isArray(erros) && erros.length > 0) {
            this.mapaInvalido = true;
            this.mensagensMapa = this.mensagensMapa.concat(erros);
          }

          return this.mapaInvalido;
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

        formataObjeto(valor, campo) {
          if (campo.regrasDeValor && campo.regrasDeValor.length > 0) {
            var regra = _.find(campo.regrasDeValor, {valor: valor});
            if (regra && regra.objeto) {
              return regra.objeto;
            }

            var geral = _.find(campo.regrasDeValor, {geral: true});
            if (geral && geral.objeto) {
              return geral.objeto;
            }
          }
        }

        formataData(valor) {
          var data = valor;

          if (valor instanceof Date === false) {
            data = moment(valor, [
              'DD/MM/YYYY',
              'DD-MM-YYYY',
              'DD.MM.YYYY',
              'YYYY/MM/DD',
              'YYYY-MM-DD',
              'YYYY.MM.DD',
              'DD/MM/YY',
              'DD-MM-YY',
              'DD.MM.YY'
            ]);
          }

          if (moment(data).isValid()) {
            return moment(data).utc().format('YYYY-MM-DD');
          }

          return valor === undefined ? '' : valor;
        }

        formataTexto(valor) {
          if (typeof valor !== "string") {
            valor = valor === undefined ? '' : valor.toString();
          }

          return valor.length <= 255 ? valor : valor.substring(255, 0);
        }

        formataValor(valor, campo) {
          switch(campo.tipo) {
            case Date:
              return this.formataData(valor);
            case String:
              if (!campo.tamanhoCompleto) {
                return this.formataTexto(valor);
              }
            default:
              return valor;
          }
        }

        mapearLinhas(linhas, formatar) {
          var itens = [];
          linhas.forEach((linha) => {
            var item = {};
            this.campos.forEach((campo) => {
              if (!!campo.coluna) {
                var coluna = _.find(this.colunas, {numero: campo.coluna});
                var valor = linha[coluna.nome];

                item[campo.chave] = formatar ? this.formataValor(valor, campo) : valor;
              }
            });
            itens.push(item);
          });
          return itens;
        }

        aplicarRegrasDeValor(linhas) {
          return $q((res) => {
            var linhasMapeadas = this.mapearLinhas(linhas);

            for (var c = 0; c < this.campos.length; c++) {
              var campo = this.campos[c];
              if (campo.tipo !== Object) {
                continue;
              }
  
              if (campo.objetoRegraFiltroLinhas) {
                linhasMapeadas = _.filter(linhasMapeadas, campo.objetoRegraFiltroLinhas);
              }
  
              // Força obrigatoriedade de colunas que tenham linhas mapeadas para vínculo e remove dos
              // que não tem linhas quando a coluna do arquivo não foi mapeada.
              if (campo.obrigatorio) {
                campo.obrigatorio = linhasMapeadas.length > 0;
              }
              campo.quantidadeRegrasSemVinculo = 0;
  
              if (!!campo.coluna) {
                var distinct = _.groupBy(linhasMapeadas, (l) => { return l[campo.chave]; });

                campo.regrasDeValor = Object.keys(distinct).map((key, index) => {
                  var valor = key === 'undefined' ? '' : key;
                  var regra = new RegraImportacao({
                    valor: valor,
                    quantidade: distinct[key].length,
                    objeto: campo.objetoAutoVinculo(key),
                    obrigatoria: campo.obrigatorio
                  });
                  if (!regra.autoVinculoAplicado) {
                    campo.quantidadeRegrasSemVinculo++;
                  }
                  return regra;
                });
              }
              else {
                campo.regrasDeValor = [new RegraImportacao({
                  valor: null,
                  geral: true,
                  quantidade: linhasMapeadas.length,
                  objeto: null,
                  obrigatoria: campo.obrigatorio
                })];
                campo.quantidadeRegrasSemVinculo++;
              }
            }

            this.resumirRegrasDeValor().then((resumo) => res(resumo));
          });
        }

        resumirRegrasDeValor() {
          return $q((res) => {
            var valores = 0;
            var vinculados = 0;
            var nulosValidos = 0;
            var nulosInvalidos = 0;

            for (var c = 0; c < this.campos.length; c++) {
              var campo = this.campos[c];
              if (campo.tipo !== Object) {
                continue;
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

                for (var r = 0; r < campo.regrasDeValor.length; r++) {
                  var regra = campo.regrasDeValor[r];
                  if (!regra.objeto && regra.obrigatoria) {
                    campo.resumoRegrasDeValor.nulosInvalidos++;
                  }
                  else if (!regra.objeto) {
                    campo.resumoRegrasDeValor.nulosValidos++;
                  }
                  else {
                    campo.resumoRegrasDeValor.vinculados++;
                  }
                  campo.resumoRegrasDeValor.valores++;
                }
              }
  
              valores += campo.resumoRegrasDeValor.valores;
              vinculados += campo.resumoRegrasDeValor.vinculados;
              nulosValidos += campo.resumoRegrasDeValor.nulosValidos;
              nulosInvalidos += campo.resumoRegrasDeValor.nulosInvalidos;
            }
  
            res({
              valores: valores,
              vinculados: vinculados,
              nulosValidos: nulosValidos,
              nulosInvalidos: nulosInvalidos
            });
          });
        }

        montarLote(linhas, nomeArquivo) {
          var lote = new LoteImportacao({
            nomeArquivo: nomeArquivo,
            itens: []
          });

          this.mapearLinhas(linhas, true).forEach((obj, index) => {

            this.campos.forEach((campo) => {
              if (campo.tipo !== Object) {
                return;
              }
              if (campo.objetoRegraFiltroLinhas && _.filter([obj], campo.objetoRegraFiltroLinhas).length === 0) {
                obj[campo.chave] = undefined;
                return;
              }

              var valor = obj[campo.chave] === undefined ? '' : obj[campo.chave];
              obj[campo.chave] = this.formataObjeto(valor, campo);
            });

            lote.itens.push(new ItemImportacao(index + 2, obj));
          });

          return lote;
        }

      }

      return Importacao;
    }
  ]);
}(angular));
