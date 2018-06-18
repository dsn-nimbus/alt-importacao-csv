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

          function workbookToJson(workbook) {
            var result = {};
            workbook.SheetNames.forEach((sheetName) => {
              var row = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
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
              var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];
              var hdr = '';
              if (cell && cell.t) {
                hdr = XLSX.utils.format_cell(cell);
              }
              headers.push(hdr);
            }
            return headers;
          }

          el.on('change', (changeEvent) => {
            carregandoService.exibe();
            var reader = new FileReader();
            reader.onload = function (e) {
              var bstr = e.target.result;
              var workbook = XLSX.read(bstr, {type:'binary'});
              var fileObject = workbookToJson(workbook);
              var linhas = fileObject[Object.keys(fileObject)[0]];
              var colunas = obterColunas(workbook.Sheets[workbook.SheetNames[0]]);
              var path = $(el[0]).val();
              var nome = path ? path.split('\\')[2] : '';
              var extensao = nome.split('.')[1];
              var valido = extensaoValida(extensao);
              var mensagem = valido ? '' : 'Tipo de arquivo inválido.';

              scope.$apply(() => {
                ngModel.$setViewValue({
                  nome: nome,
                  linhas: linhas,
                  colunas: colunas,
                  extensao: extensao,
                  valido: valido,
                  mensagem: mensagem
                });
                ngModel.$render();
                $(el).val('');
                carregandoService.esconde();
              });
            };
            reader.readAsBinaryString(changeEvent.target.files[0]);
          });
        }
      };
    }
  ]);

}(angular));
