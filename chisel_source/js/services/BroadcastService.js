angular.module('broadcastService', []).factory('BroadcastService', function($rootScope){
    var service = {};
    service.topValue = 0;
    service.middleValue = 0;
    service.bottomValue = 0;
    service.requestIdentifier = 0;
    service.clusterOption = '';

    service.updateClusterOptionValue = function(value){
        this.clusterOption = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    
    service.updateTopValue = function(value){
        this.topValue = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.updateMiddleValue = function(value){
        this.middleValue = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.updateBottomValue = function(value){
        this.bottomValue = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.updateRequestIdentifier = function(rid) {
    	this.requestIdentifier = rid;
    	$rootScope.$broadcast("valuesUpdated");
    }
    
    return service;
});