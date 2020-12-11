;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
  .directive('altImportacaoCsvLeitor', [
    'XLS',
    'XLSX',
    'AltCarregandoInfoService',
    function(XLS, XLSX, carregandoService) {
      return {
        require: 'ngModel',
        scope: {opts: '='},
        link: (scope, el, attrs, ngModel) => {
          var MAX_SIZE = 2097152;
          var MAX_SIZE_TEXT = '2MB';
          var MAX_REGS = 3000;
          var MAX_REGS_TEXT = '3.000';

          scope.dadosArquivo = null;
          scope.file = null;
          scope.path = null;

          function workbookToJson(workbook, sheetToJsonOptions) {
            var result = {};
            workbook.SheetNames.forEach((sheetName) => {
              var row = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], sheetToJsonOptions);
              
              if (row.length > 0) {
                result[sheetName] = row;
              }
            });

            return result;
          }

          function obterExtensao (name) {
            return name.substring(name.lastIndexOf('.') + 1, name.length).toLowerCase();
          }

          function extensaoValida(extensao) {
            switch (extensao) {
              case 'xls':
                return true;
              case 'xlsx':
                return true;
              case 'csv':
                return true;
              case 'ods':
                return true;
              default:
                return false;
            }
          }

          function obterColunas(sheet) {
            var headers = [];

            if (!sheet) {
              return headers;
            }

            var range = XLSX.utils.decode_range(sheet['!ref']);
            var C, R = range.s.r;

            for (C = range.s.c; C <= range.e.c; ++C) {
              var hdr = '';

              if (!!scope.opts && scope.opts.colunasPossuemTitulos) {
                var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];

                if (cell && cell.t) {
                  hdr = XLSX.utils.format_cell(cell);
                } else {
                  hdr = 'coluna ' + (C + 1);
                }
              } else {
                hdr = 'coluna ' + (C + 1);
              }

              headers.push(hdr);
            }
            return headers;
          }

          function obterLinhas (workbook, colunas) {
            let sheetToJsonOptions = {
              raw: true,
              range: 1,
              header: colunas
            };

            if (!!scope.opts && !scope.opts.colunasPossuemTitulos && !!colunas && colunas.length) {
              sheetToJsonOptions.range = 0;
            }

            var fileObject = workbookToJson(workbook, sheetToJsonOptions);

            return fileObject[Object.keys(fileObject)[0]];
          }

          function parseBinariosParaUtf8(binarios) {
            try {
              // Se a string (binary, no caso) do arquivo NÃO estiver em utf8 NÃO dará erro
              return decodeURIComponent(escape(binarios));
            } catch(e) {
              // Caso dê erro significa que já está em utf8 e apenas retornaremos o arquivo
              return binarios;
            }
          }

          function fileReaderHandler (file) {
            var reader = new FileReader();

            carregandoService.exibe();

            reader.onload = function (e) {
              var bstr = undefined;
              var workbook = undefined;
              var colunas = [];
              var linhas = [];

              scope.path = scope.path ? scope.path : ng.element(el[0]).val();

              var nome = scope.path ? scope.path.split('\\')[2] : '';
              var extensao = obterExtensao(nome);
              var size = file.size;

              var valido = true;
              var mensagem = '';

              // valida extensao
              if (!extensaoValida(extensao)) {
                valido = false;
                mensagem = 'Selecione um arquivo válido, tipos permitidos: XLS, XLSX, CSV e ODS';
              }

              // valida tamanho do arquivo
              else if (size > MAX_SIZE) {
                valido = false;
                mensagem = 'Selecione um arquivo válido, o tamanho máximo de arquivo permitido é de ' + MAX_SIZE_TEXT;
              }

              else {
                // le o arquivo e monta colunas e linhas
                bstr = e.target.result;

                // Primeiro, verificar e faz o parser (quando necessário) para UTF-8
                bstr = parseBinariosParaUtf8(e.target.result);

                workbook = XLSX.read(bstr, {type: 'binary', cellDates: true});
                colunas = obterColunas(workbook.Sheets[workbook.SheetNames[0]]);
                linhas = obterLinhas(workbook, colunas);
              }

              // valida quantidade de registros
              if (linhas.length > MAX_REGS) {
                valido = false;
                mensagem = 'Selecione um arquivo válido, a quantidade máxima permitida para importação é de ' + MAX_REGS_TEXT + ' registros';
              }

              scope.dadosArquivo = {
                colunas: colunas,
                linhas: linhas,
                dezPrimeirasLinhas: linhas.slice(0, 10),
                nome: nome,
                extensao: extensao,
                valido: valido,
                mensagem: mensagem
              };

              scope.$apply(() => {
                ngModel.$setViewValue(scope.dadosArquivo);
                ngModel.$render();
                ng.element(el).val('');

                carregandoService.esconde();
              });
            };

            reader.readAsBinaryString(file);
          }

          function onChangeHandler (changeEvent) {
            carregandoService.exibe();

            scope.dadosArquivo = null;
            scope.file = null;
            scope.path = null;

            scope.file = changeEvent.target.files[0];
            fileReaderHandler(scope.file);
          }

          el.on('change', onChangeHandler);

          scope.$watch('opts.colunasPossuemTitulos', (newValue, oldValue) => {
            if (!scope.dadosArquivo) {
              ng.element(el).val('');
              scope.file = null;
            } else if ((!!newValue || !!oldValue) && newValue !== undefined && !!scope.file) {
              fileReaderHandler(scope.file);
            } else {
              scope.dadosArquivo = undefined;
              ng.element(el).val('');
            }
          });
        }
      };
    }
  ]);
}(angular));
