mainRouter.controller('DeleteCtrl', [ '$scope', 'ModelSvc', '$q', function($scope, ModelSvc, $q) {
	$scope.deleteCtrlSource = ModelSvc.getSelectedRequest();
} ]);