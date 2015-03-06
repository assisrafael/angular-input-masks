/**
 * Created by lsneto on 26/02/15.
 */

'use strict';

angular.module('ui.utils.masks.data', [])
  .directive('uiDataMask', [function() {
    var dataMask = new StringMask('00/00/0000');

    function clearValue (value) {
      if(!value) {
        return value;
      }

      return value.replace(/[^0-9]/g, '');
    }

    function applyDataMask (value, ctrl) {
      if(!value) {
        ctrl.$setValidity('data', true);
        return value;
      }
      var processed = dataMask.process(value);
      ctrl.$setValidity('data', processed.valid);
      var formatedValue = processed.result;
      return formatedValue.trim().replace(/[^0-9]$/, '');
    }

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ctrl) {
        if (!ctrl) {
          return;
        }

        ctrl.$formatters.push(function(value) {
          return applyDataMask(value, ctrl);
        });

        ctrl.$parsers.push(function(value) {
          if (!value) {
            return applyDataMask(value, ctrl);
          }

          var cleanValue = clearValue(value);
          var formatedValue = applyDataMask(cleanValue, ctrl);

          if (ctrl.$viewValue !== formatedValue) {
            ctrl.$setViewValue(formatedValue);
            ctrl.$render();
          }

          return clearValue(formatedValue);
        });
      }
    };
  }]);
