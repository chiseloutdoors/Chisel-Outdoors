/*mainRouter.directive('numbersOnly', ['ModelSvc', function(ModelSvc) {
	  return {
		    restrict: 'CA',
		    replace: false,
		    transclude: false,
		    scope: {
		            meta: '=meta'
		    },
		    //template: '<a href="#">{{meta.requestDetails.initiativeName}}</a>',
		    link: function(scope, elem, attrs) {
		    	elem.addClass('form-control');
		    	elem.bind('keyup', function(e) {
		    		//var char = String.fromCharCode(e.which||e.charCode||e.keyCode), matches = [];
		            console.log(elem.context.name);
		            console.log(scope.request);
		      });
		    }
		  }
} ]);*/

mainRouter.directive('numbersOnly', function ($parse) {
    return {
    	restrict: 'CA',
	    replace: false,
	    transclude: false,
	    scope: {
	            meta: '=meta'
	    },
        link: function (scope, elm, attrs) {
        elm.addClass('form-control');
          elm.bind('keypress', function(e){
            var char = String.fromCharCode(e.which||e.charCode||e.keyCode), matches = [];
            angular.forEach(['1','2','3','4','5','6','7','8','9','0','.'], function(value, key){
              if(char === value) matches.push(char);
            }, matches);
            if(matches.length == 0){
              e.preventDefault();
              return false;
            }
          });
        }
    }   
});

mainRouter.directive('noEdit', ['ModelSvc', function(ModelSvc) {
	  return {
		    restrict: 'CA',
		    replace: false,
		    transclude: false,
		    scope: {
		            meta: '=meta'
		    },
		    //template: '<a href="#">{{meta.requestDetails.initiativeName}}</a>',
		    link: function(scope, elem, attrs) {
		    	elem.addClass('form-control');
		    	elem.bind('keyup', function(ev) {
		    		elem.val(ModelSvc.getUid());
		      });
		    }
		  }
} ]);

mainRouter.directive('attuidEdit', ['ModelSvc', function(ModelSvc) {
	  return {
		    restrict: 'CA',
		    replace: false,
		    transclude: false,
		    scope: {
		            meta: '=meta'
		    },
		    //template: '<a href="#">{{meta.requestDetails.initiativeName}}</a>',
		    link: function(scope, elem, attrs) {
		    	elem.addClass('form-control ' + elem[0].className);
		    	elem.bind('keypress', function(e){
		            var char = String.fromCharCode(e.which||e.charCode||e.keyCode), matches = [];
		            //'1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','a','a','a','a','a','a'
		            angular.forEach([',','.','!',';','(',')','@','#','$','%','^','&','*'], function(value, key){
		              if(char === value) matches.push(char);
		            }, matches);
		            if(matches.length != 0 || elem.val().length > 6){
		              e.preventDefault();
		              return false;
		            }
		          });
		    	/*elem.bind('keyup', function(ev) {
		    		var transformed = elem.val().replace(/[^\w\s]/gi, '');
		    		if(transformed.length > 6) {
		    			transformed = transformed.substring(0,6);
		    		}
		    		elem.val(transformed);
		      });*/
		    }
		  }
} ]);