;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv', [
    'alt.modal-service',
    'alt.select-service',
    'alt.alerta-flutuante',
    'alt.carregando-info'
  ])
  .constant('AltImportacaoCsvEvento', {
    modal: {
      ABRE_MODAL_IMPORTACAO_ESPECIFICA: 'alt-importacao-csv:abrir_modal_importacao_especifica'
    },
    processamento: {
      ATUALIZAR_LOTE: 'alt-importacao-csv:atualizar_processamento_lote'
    }
  })
  .constant('ARRAY_CARACTERES_ACENTUACAO_UTF8', [

    "á", "à", "â", "ã", "ä", "é", "è", "ê", "ë", "í",
    "ì", "î", "ï", "ó", "ò", "ô", "õ", "ö", "ú", "ù",
    "û", "ü", "ç", "Á", "À", "Â", "Ã", "Ä", "É", "È",
    "Ê", "Ë", "Í", "Ì", "Î", "Ï", "Ó", "Ò", "Ô", "Õ",
    "Ö", "Ú", "Ù", "Û", "Ü", "Ç", "°",
  ])
  .constant('ARRAY_CARACTERES_ACENTUACAO_ISO', [

    "Ã¡","Ã ","Ã¢","Ã£","Ã¤","Ã©","Ã¨","Ãª","Ã«","Ã­",
    "Ã¬","Ã®","Ã¯","Ã³","Ã²","Ã´", "Ãµ","Ã¶","Ãº","Ã¹",
    "Ã»","Ã¼","Ã§","Ã","Ã€","Ã‚","Ã","Ã„","Ã","Ãˆ",
    "ÃŠ","Ã‹", "Ã","ÃŒ","ÃŽ","Ã","Ã“","Ã’","Ã”","Ã•",
    "Ã–","Ãš","Ã™","Ã›","Ãœ","Ã", "Â°", "Ã"
  ])
  .constant('latinize', latinize)
  .constant('_', _)
  .constant('moment', moment)
  .constant('XLS', XLS)
  .constant('XLSX', XLSX);

}(angular));
