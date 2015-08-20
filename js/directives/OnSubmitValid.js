mainRouter
.directive('onSubmitValid', ['$parse', '$timeout', function($parse, $timeout) {
    return {
        require: '^form',
        restrict: 'A',
        link: function(scope, element, attrs, form) {
            form.$submitted = false;
            var fn = $parse(attrs.onSubmitValid);
            element.on('submit', function(event) {
                scope.$apply(function() {
                    element.addClass('ng-submitted');
                    form.$submitted = true;
                    if (form.$valid) {
                        if (typeof fn === 'function') {
                            fn(scope, {$event: event});
                            form.$submitted = false;
                        }
                    }
                });
            });
        }
    }
}]);