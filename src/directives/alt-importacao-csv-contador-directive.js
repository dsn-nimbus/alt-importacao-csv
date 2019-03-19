;
(function (ng) {
  'use strict';

  /**
   * @desc Contador para display de labels numéricos.
   */
  ng.module('alt.importacao-csv')
    .directive('altImportacaoCsvContador', ['$timeout', function ($timeout) {
      return {
        scope: {
          countFrom: '=',
          countTo: '=',
          duration: '@'
        },
        link: function (scope, element, attrs) {

          let e = element[0];
          let num, refreshInterval, duration, steps, step, countTo, value, increment;

          let calculate = function () {
            refreshInterval = 30;
            step = 0;
            scope.timoutId = null;
            countTo = parseInt(scope.countTo) || 0;
            scope.value = parseInt(scope.countFrom) || 0;
            duration = (parseFloat(attrs.duration) * 1000) || 0;

            steps = Math.ceil(duration / refreshInterval);
            increment = ((countTo - scope.value) / steps);
            num = scope.value;
          }

          let tick = function () {
            scope.timoutId = $timeout(function () {
              num += increment;
              step++;
              if (step >= steps) {
                $timeout.cancel(scope.timoutId);
                num = countTo;
                e.textContent = countTo;
              } else {
                e.textContent = Math.round(num);
                tick();
              }
            }, refreshInterval);

          }

          let start = function () {
            if (scope.timoutId) {
              $timeout.cancel(scope.timoutId);
            }
            calculate();
            tick();
          }

          scope.$watch('countTo', (newVal) => {
            if (!!newVal) {
              start();
            }
          });

          return true;
        }
      };
    }
    ])
}(angular));