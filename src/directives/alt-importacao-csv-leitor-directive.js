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
                }
              } else {
                hdr = 'coluna ' + (C + 1);
              }

              headers.push(hdr);
            }
            return headers;
          }

          function obterLinhas (workbook, colunas) {
            let sheetToJsonOptions = {};

            if (!!scope.opts && !scope.opts.colunasPossuemTitulos && !!colunas && colunas.length) {
              sheetToJsonOptions.header = colunas;
            }

            var fileObject = workbookToJson(workbook, sheetToJsonOptions);
            return fileObject[Object.keys(fileObject)[0]];
          }

          function fileReaderHandler (file) {
            var reader = new FileReader();

            carregandoService.exibe();

            reader.onload = function (e) {
              var bstr = e.target.result;
              var workbook = XLSX.read(bstr, {type:'binary'});
              var colunas = obterColunas(workbook.Sheets[workbook.SheetNames[0]]);
              var linhas = obterLinhas(workbook, colunas);

              scope.path = !!scope.path ? scope.path : ng.element(el[0]).val();
              var nome = scope.path ? scope.path.split('\\')[2] : '';
              var extensao = nome.split('.')[1];
              var valido = extensaoValida(extensao);
              var mensagem = valido ? '' : 'Tipo de arquivo inválido.';

              scope.dadosArquivo = {
                colunas: colunas,
                linhas: linhas,
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
            if ((!!newValue || !!oldValue) && !!scope.file) {
              fileReaderHandler(scope.file);
            }
          });

          /* el.on('change', (changeEvent) => {
            var reader = new FileReader();

            scope.file = changeEvent.target.files[0];

            carregandoService.exibe();

            reader.onload = function (e) {
              var bstr = e.target.result;
              var workbook = XLSX.read(bstr, {type:'binary'});
              var colunas = obterColunas(workbook.Sheets[workbook.SheetNames[0]]);
              var linhas = obterLinhas(workbook, colunas);

              var path = ng.element(el[0]).val();
              var nome = path ? path.split('\\')[2] : '';
              var extensao = nome.split('.')[1];
              var valido = extensaoValida(extensao);
              var mensagem = valido ? '' : 'Tipo de arquivo inválido.';

              scope.dadosArquivo = {
                colunas: colunas,
                linhas: linhas,
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

            reader.readAsBinaryString(scope.file);
          }); */
        }
      };
    }
  ]);
}(angular));
