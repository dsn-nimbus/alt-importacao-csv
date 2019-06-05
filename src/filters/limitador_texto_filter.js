;(function(ng) {
    'use strict';

    ng.module('alt.importacao-csv')
    /**
    * @description Filtro que retorna o texto limitado
    * @class alt.importacao-csv.LimitadorTexto
    * @memberof alt.importacao-csv
    */
    .filter('LimitadorTexto', ['_', function (_) {
      /**
       * @description Retorna o texto limitado
       * @memberof alt.importacao-csv.LimitadorTexto
       * @function limitadorTexto
       * @param {string} o texto a ser filtrado
       * @param {number} o número do limite
       * @returns {string} retorna a string limitada
       * @inner
       */
      return function (input, val) {
          if (!input) {
              return;
          }

          var _tamanho = val || 53;

          if (input.length > _tamanho) {
              input = _.truncate(input, {
                  length: _tamanho
              });
          }

          return typeof input === "string" ? input.trim() : input;
      };
    }]);
}(angular));
