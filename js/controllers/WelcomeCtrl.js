mainRouter.controller('WelcomeCtrl', ['$scope', 'Api', '$q', 'ModelSvc', '$state', 'BroadcastService', function($scope, Api, $q, ModelSvc, $state, BroadcastService) {
	$scope.name = 'Eric Escamilla';
	$scope.requests = [];
	$scope.existingWorkspaces = 0;
	$scope.existingReports = [];
	$scope.reports = '';
	$scope.clusterOption = '';
	
	function setTriggeredView(viewTrigger) {
		if(viewTrigger == 'create') {
			ModelSvc.setRequestIdentifier(0);
			ModelSvc.clearSelectedSources();
			$state.go('create');
		}
		if(viewTrigger == 'modify') {
			$state.go('modify');
		}
		if(viewTrigger == 'delete') {
			$state.go('delete');
		}
		if(viewTrigger == 'decomission') {
			$state.go(viewTrigger);
		}
	}
	$scope.setTriggeredView = setTriggeredView;
	
	setTimeout(function(){if(ModelSvc.getUserRole() == null){window.location="/";}},2000);
}]);