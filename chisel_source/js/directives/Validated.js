mainRouter
.directive('validated', ['$parse', function($parse) {
    return {
        restrict: 'AEC',
        require: '^form',
        link: function(scope, element, attrs, form) {
            var inputs = element.find("*");
            for(var i = 0; i < inputs.length; i++) {
                (function(input){
                    var attributes = input.attributes;
                    if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                        var field = form[attributes.name.value];
                        if (field != void 0) {
                            scope.$watch(function() {
                                return form.$submitted + "_" + field.$valid;
                            }, function() {
                                if (form.$submitted != true) return;
                                var el = $("select[name], input[name], textarea[name]", element).first();
                                if (el.attr("requiredif") &&
                                    !eval(el.attr("requiredif"))) {
                                  field.$invalid = true;
                                }
                                if(field.$invalid){
                                    element.removeClass('has-success');
                                    element.addClass('has-error');
                                    var text = el.attr("errortxt") || el.attr("name") + " is required"
                                    el.after("<div class='errortxt'>" + text + "</div>");
                                } else {
                                    element.removeClass('has-error');
                                    element.addClass('has-success');
                                    $(".errortxt", element).remove();
                                }
                            });
                        }
                    }
                })(inputs[i]);
            }
        }
    }
}]);