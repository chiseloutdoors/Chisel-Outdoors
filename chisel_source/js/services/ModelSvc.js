mainRouter.factory('ModelSvc',
		function($rootScope) {
			var selectedRequest = null;
			var uid = null;
			var userRequests = null;
			var coeThemes = null;
			var clusterOption = null;
			var clusterOptions = null;
			var statusLegend = null;
			var userRole = "";
			var reportId = null;
			var sourceNames = null;
			var requestIdentifier = null;
			var chosenRequest = null;
			var sourceNameOptionsSet = false;
			var selectedWorkspace = null;
			var selectedDecomissionRequest = null;
			var maximumHdfsCapacity = 98;
			
			var setMaximumHdfsCapacity = function(limit) {
				maximumHdfsCapacity = limit;
			}
			var getMaximumHdfsCapacity = function() {
				return maximumHdfsCapacity;
			}
			
			var setSelectedDecomissionRequest = function(sdr) {
				selectedDecomissionRequest = sdr;
				$rootScope.$broadcast('updateSelectedDecomissionRequest', sdr);
			}
			var getSelectedDecomissionRequest = function() {
				return selectedDecomissionRequest;
			}
			
			var clearSelectedSources = function() {
				$rootScope.$broadcast('clearSelectedSources');
			}
			
			var setSourceNameOptionsSet = function(bool) {
				sourceNameOptionsSet = bool;
			}
			var getSourceNameOptionsSet = function() {
				return sourceNameOptionsSet;
			}			
			
			var statusLegend = [ "Draft", "CoE Review", "HA Provisioning",
					"Active", "", "", "Waiting for Soft Removal blah blah", "Wait for Final Removal blah blah", "Decomissioned" ];

			var legend = {
				"WSRequestors" : {
					"formValues" : {
						"requestDetailsFormPermission" : false,
						"sourceDetailsFormPermission" : false,
						"coeApprovalFormPermission" : true,
						"workspaceConfigurationFormPermission" : true,
						"workspaceOwnerDisabled":true
					},
					"submitValues" : {
						"draftRequest" : 0,
						"submitRequest" : 1,
						"cancelDisabled":false,
						"saveDraftDisabled":false
					},
					"accordionViews": {
						"requestDetailsArea":{"class":"panel-collapse collapse in","downCaret":true},
						"sourcesArea":{"class":"panel-collapse collapse","downCaret":false},
						"coeReviewArea":{"class":"panel-collapse collapse","downCaret":false},
						"hadoopAdminArea":{"class":"panel-collapse collapse","downCaret":false}
					},
					"decomissionView":{
						"submit":false
					}
				},
				"WSCOES" : {
					"formValues" : {
						"requestDetailsFormPermission" : true,
						"sourceDetailsFormPermission" : true,
						"coeApprovalFormPermission" : false,
						"workspaceConfigurationFormPermission" : true,
						"workspaceOwnerDisabled":true
					},
					"requestsView":{
						"level":2
					},
					"submitValues" : {
						"submitRequest" : 2,
						"cancelDisabled":false,
						"saveDraftDisabled":true
					},
					"accordionViews": {
						"requestDetailsArea":{"class":"panel-collapse collapse in","downCaret":true},
						"sourcesArea":{"class":"panel-collapse collapse","downCaret":false},
						"coeReviewArea":{"class":"panel-collapse collapse","downCaret":false},
						"hadoopAdminArea":{"class":"panel-collapse collapse","downCaret":false}
					}
				},
				"WSHA" : {
					"formValues" : {
						"requestDetailsFormPermission" : true,
						"sourceDetailsFormPermission" : true,
						"coeApprovalFormPermission" : true,
						"workspaceConfigurationFormPermission" : true,
						"workspaceOwnerDisabled":true
					},
					"requestsView":{
						"level":3
					},
					"submitValues" : {
						"submitRequest" : 3,
						"cancelDisabled":false,
						"saveDraftDisabled":true
					},
					"accordionViews": {
						"requestDetailsArea":{"class":"panel-collapse collapse in","downCaret":true},
						"sourcesArea":{"class":"panel-collapse collapse","downCaret":false},
						"coeReviewArea":{"class":"panel-collapse collapse","downCaret":false},
						"hadoopAdminArea":{"class":"panel-collapse collapse","downCaret":false}
					}
				},
			"WSEveryone" : {
				"formValues" : {
					"requestDetailsFormPermission" : false,
					"sourceDetailsFormPermission" : true,
					"coeApprovalFormPermission" : true,
					"workspaceConfigurationFormPermission" : true,
					"workspaceOwnerDisabled":true
				},
				"requestsView":{
					"level":3
				},
				"submitValues" : {
					"draftRequest":0,
					"submitRequest" : 1,
					"cancelDisabled":false,
					"saveDraftDisabled":true
				},
				"accordionViews": {
					"requestDetailsArea":{"class":"panel-collapse collapse in","downCaret":true},
					"sourcesArea":{"class":"panel-collapse collapse","downCaret":false},
					"coeReviewArea":{"class":"panel-collapse collapse","downCaret":false},
					"hadoopAdminArea":{"class":"panel-collapse collapse","downCaret":false}
				}
			},
			"WSCOMPLIANCE" : {
				"formValues" : {
					"requestDetailsFormPermission" : true,
					"sourceDetailsFormPermission" : true,
					"coeApprovalFormPermission" : true,
					"workspaceConfigurationFormPermission" : true,
					"workspaceOwnerDisabled":true
				},
				"requestsView":{
					"level":3
				},
				"submitValues" : {
					"draftRequest":0,
					"submitRequest" : 1,
					"cancelDisabled":false,
					"saveDraftDisabled":true
				},
				"accordionViews": {
					"requestDetailsArea":{"class":"panel-collapse collapse in","downCaret":true},
					"sourcesArea":{"class":"panel-collapse collapse","downCaret":false},
					"coeReviewArea":{"class":"panel-collapse collapse","downCaret":false},
					"hadoopAdminArea":{"class":"panel-collapse collapse","downCaret":false}
				}
			}
		};
			
			var coeWorkspaceDecisions = [{label:'Approve',value:1},{label:'Reject',value:2},{label:'',value:3}];
			
			var getCoeWorkspaceDecisions = function() {
				return coeWorkspaceDecisions;
			}
			
			var setLegend = function(newLegend) {
				legend = newLegend;
			}
			var getLegend = function() {
				return legend;
			}

			var setUserRole = function(userObj) {
				userRole = userObj;
			}
			var getUserRole = function() {
				return userRole;
			}

      var setReportId = function(reportId) {
        reportId = reportId;
      }
      var getReportId = function() {
        return reportId;
      }

			var setChosenRequest = function(chosenreq) {
				chosenRequest = chosenreq;
			}
			var getChosenRequest = function() {
				return chosenRequest;
			}

			var setRequestIdentifier = function(requestIdentifier1) {
				requestIdentifier = requestIdentifier1;
				$rootScope.$broadcast('updateRequestIdentifier',
						requestIdentifier1);
			}
			var getRequestIdentifier = function() {
				return requestIdentifier;
			}

			var setSelectedRequest = function(newRequest) {
				selectedRequest = newRequest;
			}

			var getSelectedRequest = function() {
				return selectedRequest;
			}

			var setUid = function(newUid) {
				uid = newUid;
			}

			var getUid = function() {
				return uid;
			}

			var setUserRequests = function(requests) {
				userRequests = requests;
				$rootScope.$broadcast('updateUserRequests', requests);
			}

			var getUserRequests = function() {
				return userRequests;
			}

			var setCoeThemes = function(newCoeThemes) {
				coeThemes = newCoeThemes;
			}

			var getCoeThemes = function() {
				return coeThemes;
			}

			var setClusterOption = function(newClusterOption) {
				clusterOption = newClusterOption;
				$rootScope.$broadcast('setClusterOption', newClusterOption);
			}

			var getClusterOption = function() {
				return clusterOption;
			}

			var setClusterOptions = function(newClusterOption) {
				clusterOptions = newClusterOption;
			}

			var getClusterOptions = function() {
				return clusterOptions;
			}

			var setStatusLegend = function(newClusterOption) {
				statusLegend = newClusterOption;
			}

			var getStatusLegend = function() {
				return statusLegend;
			}

			var setSourceNames = function(sourcenames) {
				sourceNames = sourcenames;
			}
			var getSourceNames = function() {
				return sourceNames;
			}

			var setStatusLegend = function(statusLegendu) {
				statusLegend = statusLegendu;
			}
			var getStatusLegend = function() {
				return statusLegend;
			}
			
			var setSelectedWorkspace = function(newselectedworkspace) {
				selectedWorkspace = newselectedworkspace;
				$rootScope.$broadcast('updateWorkspace', selectedWorkspace);
			}
			var getSelectedWorkspace = function() {
				return selectedWorkspace;
			}

			var getCustomDate = function(adder) {
				function padNumber(number) {
					var string = '' + number;
					string = string.length < 2 ? '0' + string : string;
					return string;
				}
				date = new Date();
				next_date = new Date(date.setDate(date.getDate()
						+ parseFloat(adder)));
				formatted_next = next_date.getUTCFullYear() + '-'
						+ padNumber(next_date.getUTCMonth() + 1) + '-'
						+ padNumber(next_date.getUTCDate());
				return formatted_next;
			}
			
			function sanitizeNumbersInput(stringToClean) {
				stringToClean = stringToClean.replace(/[^0-9]/g, '');
			}

			return {
				setSelectedRequest : setSelectedRequest,
				getSelectedRequest : getSelectedRequest,
				setUid : setUid,
				getUid : getUid,
				setUserRequests : setUserRequests,
				getUserRequests : getUserRequests,
				setCoeThemes : setCoeThemes,
				getCoeThemes : getCoeThemes,
				getCustomDate : getCustomDate,
				setClusterOption : setClusterOption,
				getClusterOption : getClusterOption,
				setClusterOptions : setClusterOptions,
				getClusterOptions : getClusterOptions,
				setStatusLegend : setStatusLegend,
				getStatusLegend : getStatusLegend,
				setUserRole : setUserRole,
				getUserRole : getUserRole,
        setReportId : setReportId,
        getReportId : getReportId,
				setSourceNames : setSourceNames,
				getSourceNames : getSourceNames,
				setRequestIdentifier : setRequestIdentifier,
				getRequestIdentifier : getRequestIdentifier,
				setChosenRequest : setChosenRequest,
				getChosenRequest : getChosenRequest,
				setLegend : setLegend,
				getLegend : getLegend,
				setSourceNameOptionsSet : setSourceNameOptionsSet,
				getSourceNameOptionsSet : getSourceNameOptionsSet,
				clearSelectedSources : clearSelectedSources,
				setSelectedWorkspace:setSelectedWorkspace,
				getSelectedWorkspace:getSelectedWorkspace,
				getSelectedDecomissionRequest:getSelectedDecomissionRequest,
				setSelectedDecomissionRequest:setSelectedDecomissionRequest,
				getCoeWorkspaceDecisions:getCoeWorkspaceDecisions,
				setMaximumHdfsCapacity:setMaximumHdfsCapacity,
				getMaximumHdfsCapacity:getMaximumHdfsCapacity
			};
		});