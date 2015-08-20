mainRouter.directive('changeBackgroundWhenClicked', [function() {
	  return {
		    restrict: 'CA',
		    replace: false,
		    transclude: false,
		    scope: {
		            meta: '=meta'
		    },
		    //template: '<a href="#">{{meta.requestDetails.initiativeName}}</a>',
		    link: function(scope, elem, attrs) {
		    	elem.addClass('requestDiv');
		    	elem.bind('click', function() {
		    		$('.changeBackgroundWhenClicked').each(function(){
		    			$(this).css({
		    				'background':'#fcfcfc'
		    			})
		    		});
		    		elem.css({
		    			'background':'#e8e8e8'
		    		});
		      });
		    }
		  }
} ]);