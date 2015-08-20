mainRouter
		.controller('LandingPageCtrl',
				[ '$scope', function($scope) {
					
					$scope.options = [{id:1,label:"first"},{id:2,label:"second"},{id:3,label:"third"}];
					$scope.selectedValue = {id:1,label:"first"};
					$scope.selectedValue = $scope.options[1];
					
				} ]);