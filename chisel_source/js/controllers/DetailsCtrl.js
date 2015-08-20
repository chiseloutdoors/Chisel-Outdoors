mainRouter
		.controller('DetailsCtrl',
				[ '$scope', 'Api', '$q', function($scope, Api, $q) {

					$scope.options = {
						width : 500,
						height : 300,
						'bar' : 'aaa'
					};
					$scope.data = [ 1, 2, 3, 4 ];
					$scope.hovered = function(d) {
						$scope.barValue = d;
						$scope.$apply();
					};
					$scope.barValue = 'None';

				} ]);