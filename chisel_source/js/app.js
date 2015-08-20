/**
 * Created by tt047x on 7/29/2014.
 */
"use strict";

var mainRouter = angular.module("mainRouter", ['ngResource', 'ui.router',
		'ui.bootstrap', 'broadcastService']);
// Define Router
mainRouter.config([
		'$stateProvider',
		'$urlRouterProvider',
		'$locationProvider',
		'$httpProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider,
				$httpProvider) {

			// $locationProvider.html5Mode(true);
			// Default path for not supported states/routes
			
			$urlRouterProvider.otherwise('/');

			// Define an abstract route with authorization
			$stateProvider.state('site', {
				'abstract' : true
			}).state('home', {
				parent : 'site',
				url : '/',
				data : {
					roles : []
				},
				views : {
					'content@' : {
						templateUrl : 'templates/welcome.html',
						controller : 'LandingPageCtrl'
					}
				}
			}).state('create', {
				parent : 'site',
				url : '/create',
				data : {
					roles : []
				},
				views : {
					'content@' : {
						templateUrl : 'templates/create.html',
						controller : 'CreateCtrl'
					}
				}
			}).state('modify', {
				parent : 'site',
				url : '/modify',
				data : {
					roles : []
				},
				views : {
					'content@' : {
						templateUrl : 'templates/modify.html',
						controller : 'ModifyCtrl'
					}
				}
			}).state('delete', {
				parent : 'site',
				url : '/delete',
				data : {
					roles : []
				},
				views : {
					'content@' : {
						templateUrl : 'templates/delete.html',
						controller : 'DeleteCtrl'
					}
				}
			}).state('workspaceoverview', {
        parent : 'site',
        url : '/workspaceoverview',
        data : {
          roles : []
        },
        views : {
          'content@' : {
            templateUrl : 'templates/reports/workspaceoverview.html',
            controller : 'ReportsCtrl'
          }
        }
      }).state('requestlog', {
        parent : 'site',
        url : '/requestlog',
        data : {
          roles : []
        },
        views : {
          'content@' : {
            templateUrl : 'templates/reports/requestlog.html',
            controller : 'ReportsCtrl'
          }
        }
      }).state('sla', {
        parent : 'site',
        url : '/sla',
        data : {
          roles : []
        },
        views : {
          'content@' : {
            templateUrl : 'templates/reports/sla.html',
            controller : 'ReportsCtrl'
          }
        }
      }).state('workspaceowners', {
        parent : 'site',
        url : '/workspaceowners',
        data : {
          roles : []
        },
        views : {
          'content@' : {
            templateUrl : 'templates/reports/workspaceowners.html',
            controller : 'ReportsCtrl'
          }
        }
      }).state('decomission', {
    	  parent:'site',
    	  url:'/decomission',
    	  data: {
    		  roles:[]
    	  },
    	  views:{
    		  'content@':{
    			  templateUrl:'templates/decomission.html',
    			  controller:'DecomissionCtrl'
    		  }
    	  }
      });
		}]);