mainRouter.controller('DecomissionCtrl', [ '$scope', 'ModelSvc', '$q', 'Api', '$filter','$state',
		function($scope, ModelSvc, $q, Api, $filter, $state) {
			$scope.coeWorkspaceDecisions = ModelSvc.getCoeWorkspaceDecisions();
			$scope.statusLegend = ModelSvc.getStatusLegend();
			$scope.legend = ModelSvc.getLegend()[ModelSvc.getUserRole()];
			$scope.decomission = null;
			$scope.submitDisabled = true;
			$scope.workspaces = [];
			$scope.permissions = {decomissionDateDisabled:true,decomissionDescriptionDisabled:true};
			$scope.decomissionRequest = {requestDetails:{status:0,decomissionDateDisabled:ModelSvc.getCustomDate(30),decomissionDescription:""}};
			$scope.workspace = null;
			$scope.userRole = ModelSvc.getUserRole();
			
			$scope.$on('updateSelectedDecomissionRequest', function(ev, option) {
				$scope.decomissionRequest = option;
				initReqForm();
			});
			$scope.modalCommands = {runOnCluster:'',hdfsDirectory:'',lzsDirectory:''};
			function setCluster(decReq) {
				$q.all([Api.Workspaces.query().$promise]).then(function(result){
					for(var tmp in result[0]) {
						if(result[0][tmp].wsId == decReq.wsId) {
							for(var i in ModelSvc.getClusterOptions()) {
								if(ModelSvc.getClusterOptions()[i].clusterId == result[0][tmp].clusterId) {
									$scope.modalCommands.runOnCluster = ModelSvc.getClusterOptions()[i].clusterCode;
									$scope.modalCommands.hdfsDirectory = result[0][tmp].hdfsDirectory;
									$scope.modalCommands.lzsDirectory = result[0][tmp].lzsDirectory;
								}
							}
						}
					}
				});
			}
			
			function initReqForm() {
			if(ModelSvc.getSelectedDecomissionRequest() == null) {
				//  Do nothing
			} else {
				var tmp = ModelSvc.getSelectedDecomissionRequest().requestDetails;
				$scope.decomissionRequest = ModelSvc.getSelectedDecomissionRequest();
				//  Get CoE Decision
				for(var i in $scope.coeWorkspaceDecisions) {
					if(ModelSvc.getSelectedDecomissionRequest().requestDetails.coeStatus.decisionStatus.value == $scope.coeWorkspaceDecisions[i].value) {
						$scope.decomissionRequest.requestDetails.coeStatus.decisionStatus = $scope.coeWorkspaceDecisions[i];
					}
				}
				if($scope.userRole != "WSRequestors" || $scope.userRole != "WSEveryone") {
					if(ModelSvc.getSelectedDecomissionRequest().requestDetails.status == 0) {
						setTimeout(function(){enableDisableButtons(false);},2000);
					} else {
						setTimeout(function(){
							if($scope.userRole == "WSHA") {
								$("[name=" + ModelSvc.getUserRole() +"-cancel]").prop('disabled', false);$("[name=" + ModelSvc.getUserRole() +"-submit]").prop('disabled', true);
							} else if($scope.userRole == "WSRequestors" && $scope.decomissionRequest.requestDetails.status > 1) {
								$("[name=" + ModelSvc.getUserRole() +"-cancel]").prop('disabled', true);$("[name=" + ModelSvc.getUserRole() +"-submit]").prop('disabled', true);
							} else {
								$("[name=" + ModelSvc.getUserRole() +"-cancel]").prop('disabled', false);$("[name=" + ModelSvc.getUserRole() +"-submit]").prop('disabled', false);
							}
						},2000);
					}
				} else {
					if($scope.decomissionRequest.requestDetails.status == 0) {
						setTimeout(function(){enableDisableButtons(false);},2000);
					}
				}
			}
			}
			initReqForm();
			
			$q.all([Api.Workspaces.query({role:ModelSvc.getUserRole(),uid:ModelSvc.getUid()}).$promise]).then(function(result) {
				$scope.workspaces = result[0];
				setCluster($scope.decomissionRequest);
				$scope.decomission = {};
				if("wsId" in $scope.decomissionRequest) {
					for(var i in $scope.workspaces) {
						if($scope.decomissionRequest.wsId == $scope.workspaces[i].wsId) {
							$scope.decomission.workspaceName = $scope.workspaces[i];
						}
					}
				}
			});
			function getWs(selectedWsWorkspacesId) {
				$q.all([Api.Workspace.query({wsWorkspacesId:selectedWsWorkspacesId}).$promise]).then(function(result) {
					$scope.workspace = result[0];
					enableDisableButtons(false);
				});
			}
			$scope.updateWorkspaceSelection = function() {
				getWs($scope.decomission.workspaceName.wsWorkspacesId);
			}
			
			$scope.caret = {decomissionDetails:'glyph-caret-down',coeReview:'glyph-caret-right',ha:'glyph-caret-right',detailsClicked:true,coeClicked:false,haClicked:false};
			$scope.updateCarets = function(area) {
				if(area == "decomissionDetails") {
					$scope.caret.detailsClicked = !$scope.caret.detailsClicked;
					if($scope.caret.detailsClicked) {
						$scope.caret.decomissionDetails = 'glyph-caret-down';
					} else {
						$scope.caret.decomissionDetails = 'glyph-caret-right';
					}
				}
				if(area == "coeReview") {
					$scope.caret.coeClicked = !$scope.caret.coeClicked;
					if($scope.caret.coeClicked) {
						$scope.caret.coeReview = 'glyph-caret-down';
					} else {
						$scope.caret.coeReview = 'glyph-caret-right';
					}
				}
				if(area == "hadoopAdmin") {
					$scope.caret.haClicked = !$scope.caret.haClicked;
					if($scope.caret.haClicked) {
						$scope.caret.ha = 'glyph-caret-down';
					} else {
						$scope.caret.ha = 'glyph-caret-right';
					}
				}
			}
			
			function saveRequest(requestToSave) {
				$q.all([Api.WorkspaceDecomission.save(requestToSave).$promise]).then(function(result) {
					$scope.decomissionRequest = result[0];
					$scope.decomissionRequest.requestDetails = JSON.parse($scope.decomissionRequest.requestDetails);
					
					$q.all([Api.Requests.query({uid:ModelSvc.getUid(),role:ModelSvc.getUserRole()}).$promise]).then(function(result) {
						ModelSvc.setUserRequests(JSON.parse(angular.toJson(result[0])));
					});
				});
			}
			
			$scope.reset = function() {
				window.location="/";
			}
			$scope.saveRequest = function(requestVersion) {
				var coeDecision = 3;
				if(typeof $scope.decomissionRequest.requestDetails.coeStatus == "undefined") {
					coeDecision = 3;
				} else {
					coeDecision = $scope.decomissionRequest.requestDetails.coeStatus.decisionStatus.value;
				}
				$scope.modal = {title:"",messageHeader:"",messageText:[],glyphiconText:"ok"};
				if(requestVersion == 0 || requestVersion == 1) {
					var request = new Object();
					if($scope.workspace == null) {
						request = $scope.decomissionRequest;
						request.wsId = $scope.decomissionRequest.wsId;
					} else {
						request.wsRequestGuid = 0;
						request.wsId = $scope.workspace.wsId;
						request.requestDetails = $scope.decomissionRequest.requestDetails;
						request.requestDetails.wsWorkspacesId = $scope.workspace.wsWorkspacesId;
						request.initiative = $scope.workspace.initiative;
						request.wsRequestType = {requestTypeId:3};
						request.requestDetails.softDeleteBy = ModelSvc.getCustomDate(30);
						request.requestDetails.hardDeleteBy = ModelSvc.getCustomDate(60);
					}
					request.step = 1;
					request.requestDetails.status = requestVersion;
					request.wsRequestorAttuid = ModelSvc.getUid();
					request.requestDetails.coeStatus = {decisionStatus:$scope.coeWorkspaceDecisions[2],statusComments:"Pending"};
					if(request.requestDetails.decomissionDescription == "") {
						$scope.modal = {title:"Error",messageHeader:"Decomission Request not submitted",messageText:["Please create a description."],glyphiconText:"warning-sign"};
						$('#decomissionDescriptionGroup').attr('class', 'form-group has-error');
					} else if(request.requestDetails.decomissionDateDisabled == "") {
						$scope.modal = {title:"Error",messageHeader:"Decomission Request not submitted",messageText:["Please give a date."],glyphiconText:"warning-sign"};
						$('#decomissionDateGroup').attr('class', 'form-group has-error');
					} else {
						$scope.modal = {title:"Request Submitted",messageHeader:"Decomission request Submitted",messageText:["Your decomission request was submitted successfully."],glyphiconText:"ok"};
					}
					if(typeof request.requestDetails != "string") {
						request.requestDetails = JSON.stringify(request.requestDetails);
					}
					forceDisable();
					request.coeDecision = coeDecision;
					//Api.WorkspaceDecomission.save(request);
					saveRequest(request);
				}
				if(requestVersion == 2) {
					console.log("Checking");
					if($scope.decomissionRequest.requestDetails.coeStatus.decisionStatus.value < 3) {
						if($scope.workspace==null) {
							var request = $scope.decomissionRequest;
							request.requestDetails.status = 6;
							request.requestDetails.softDeletedBy = null;
							request.requestDetails.hardDeletedBy = null;
							request.step = 6;
							if($scope.decomissionRequest.requestDetails.coeStatus.decisionStatus.value == 2) {
								request.requestDetails.status = 0;
							}
						} else {
							var request = new Object();
							request.wsRequestGuid = 0;
							request.wsId = $scope.workspace.wsId;
							request.wsRequestType = {requestTypeId:3};
							request.requestDetails = $scope.decomissionRequest.requestDetails;
							request.requestDetails.status = 6;
							request.requestDetails.wsWorkspacesId = $scope.workspace.wsWorkspacesId;
							request.wsRequestorAttuid = ModelSvc.getUid();
							request.initiative = $scope.workspace.initiative;
							request.requestDetails.coeStatus = {decisionStatus:$scope.coeWorkspaceDecisions[0],statusComments:"Approved"};
							request.step = 6;
							request.requestDetails.softDeleteBy = ModelSvc.getCustomDate(30);
							request.requestDetails.hardDeleteBy = ModelSvc.getCustomDate(60);
							request.requestDetails.softDeletedBy = null;
							request.requestDetails.hardDeletedBy = null;
						}
					if(request.requestDetails.decomissionDescription == "") {
						//$scope.modal = {title:"Error",messageHeader:"Decomission Request not submitted",messageText:["Please create a description."],glyphiconText:"warning-sign"};
						//$('#decomissionDescriptionGroup').attr('class', 'form-group has-error');
					} else if(request.requestDetails.decomissionDateDisabled == "") {
						$scope.modal = {title:"Error",messageHeader:"Decomission Request not submitted",messageText:["Please give a date."],glyphiconText:"warning-sign"};
						$('#decomissionDateGroup').attr('class', 'form-group has-error');
					} else {
						$scope.modal = {title:"Request Submitted",messageHeader:"Decomission request Submitted",messageText:["Your decomission request was submitted successfully."],glyphiconText:"ok"};
						forceDisable();
					}
					if(typeof request.requestDetails != "string") {
						request.requestDetails = JSON.stringify(request.requestDetails);
					}
					request.coeDecision = coeDecision;
					//Api.WorkspaceDecomission.save(request);
					saveRequest(request);
					} else {
						$scope.modal = {title:"Decision Needed",messageHeader:"Decision Needed",messageText:["Please make a decision aside from Pending"],glyphiconText:"remove"};
					}
				}
				if(requestVersion == 3) {
					if($scope.decomissionRequest.requestDetails.softDeletedBy != null && $scope.decomissionRequest.requestDetails.hardDeletedBy == null) {
						$scope.decomissionRequest.requestDetails.hardDeletedBy = ModelSvc.getUid();
						$scope.decomissionRequest.step=8;
						$scope.decomissionRequest.requestDetails.status = 8;
					}
					if($scope.decomissionRequest.requestDetails.softDeletedBy == null && $scope.decomissionRequest.requestDetails.hardDeletedBy == null) {
						$scope.decomissionRequest.requestDetails.softDeletedBy = ModelSvc.getUid();
						$scope.decomissionRequest.step=7;
						$scope.decomissionRequest.requestDetails.status = 7;
					}
					$scope.modal = {title:"Delete Submitted",messageHeader:"Decomission Delete Submitted",messageText:["Your decomission request to delete was submitted successfully."],glyphiconText:"ok"};
					if(typeof $scope.decomissionRequest.requestDetails != "string") {
						$scope.decomissionRequest.requestDetails = JSON.stringify($scope.decomissionRequest.requestDetails);
					}
					forceDisable();
					saveRequest($scope.decomissionRequest);
				}
				setTimeout(function(){
				$q.all([Api.Requests.query({uid:ModelSvc.getUid(),role:ModelSvc.getUserRole()}).$promise]).then(function(result) {
					ModelSvc.setUserRequests(JSON.parse(angular.toJson(result[0])));
				});}, 2000);
				$("#statusModal").modal();
			}
			if(ModelSvc.getUserRole() == "" || ModelSvc.getUserRole() == null) {
				window.location="/";
			} else {
				if(ModelSvc.getUserRole() == "WSEveryone") {
					$scope.permissions.decomissionDateDisabled = true;
					$scope.permissions.decomissionDescriptionDisabled = true;
					$scope.permissions.decomissionCoeDecisionDisabled = true;
					$scope.permissions.decomissionCoeCommentsDisabled = true;
				}
				if(ModelSvc.getUserRole() == "WSRequestors") {
					$scope.permissions.decomissionDateDisabled = false;
					$scope.permissions.decomissionDescriptionDisabled = false;
					$scope.permissions.decomissionCoeDecisionDisabled = true;
					$scope.permissions.decomissionCoeCommentsDisabled = true;
				}
				if(ModelSvc.getUserRole() == "WSCOES") {
					$scope.permissions.decomissionDateDisabled = false;
					$scope.permissions.decomissionDescriptionDisabled = false;
					$scope.permissions.decomissionCoeDecisionDisabled = false;
					$scope.permissions.decomissionCoeCommentsDisabled = false;
				}
				if(ModelSvc.getUserRole() == "WSHA") {
					$scope.permissions.decomissionDateDisabled = true;
					$scope.permissions.decomissionDescriptionDisabled = true;
					$scope.permissions.decomissionCoeDecisionDisabled = true;
					$scope.permissions.decomissionCoeCommentsDisabled = true;
					
					function showScript(date1, date2) {
						if(new Date(date1[0], date1[1], date1[2]) >= new Date(date2[0], date2[1], date2[2])) {
							return true;
						} else {
							return false;
						}
					}
					//  Determine if "SoftDeleteGenerateScript" should be shown
					function determineScriptDisplay() {
						$scope.hardDeleteDisabledForced = false;
						$scope.softDeleteDisabledForced = false;
						if(showScript(ModelSvc.getCustomDate(0).split("-"), $scope.decomissionRequest.requestDetails.softDeleteBy.split("-"))) {
							$scope.softDeleteDisabledForced = false;
							setTimeout(function(){
								$("#softDeleteButton").prop('disabled', false);
								}, 2000);
						} else {
							setTimeout(function(){
								$scope.softDeleteDisabledForced = true;
							$("#softDeleteButton").prop('disabled', true);
							}, 2000);
						}
						
						//  Determine if "HardDeleteGenerateScript" should be shown
						if(showScript(ModelSvc.getCustomDate(0).split("-"), $scope.decomissionRequest.requestDetails.hardDeleteBy.split("-"))) {
							$scope.hardDeleteDisabledForced = false;
							setTimeout(function(){
								$("#hardDeleteButton").prop('disabled', false);
								}, 2000);
						} else {
							$scope.hardDeleteDisabledForced = true;
							setTimeout(function(){
								$("#hardDeleteButton").prop('disabled', true);
								}, 2000);
						}
					}
					determineScriptDisplay();
				}
			}
			function forceDisable() {
				$("[name="+ModelSvc.getUserRole()+"-submit]").prop('disabled', true);
				$("[name="+ModelSvc.getUserRole()+"-save]").prop('disabled', true);
			}
			function enableDisableButtons(action) {
				if(ModelSvc.getUserRole() == "WSRequestors" || ModelSvc.getUserRole() == "WSEveryone") {
					$("[name="+ModelSvc.getUserRole()+"-submit]").prop('disabled', action);
					$("[name="+ModelSvc.getUserRole()+"-save]").prop('disabled', action);
					$("[name="+ModelSvc.getUserRole()+"-cancel]").prop('disabled', action);
				} else {
					$("[name="+ModelSvc.getUserRole()+"-submit]").prop('disabled', action);
					$("[name="+ModelSvc.getUserRole()+"-cancel]").prop('disabled', action);
				}
			}
			$('#decomissionDate').datepicker({
				autoclose : true,
				format : "yyyy-mm-dd",
				startDate:"+30d"
			});
			
			$scope.generateScript = function(action) {
				if(action == 'softDelete') {
					$scope.modal = {glyphiconText:"console",title:"Soft Delete Script", messageHeader:"Please copy the commands below and run on " + $scope.runOnCluster, messageText:["<h3>HDFS</h3>","hadoop fs -mv /" + $scope.modalCommands.hdfsDirectory + " /" + $scope.modalCommands.hdfsDirectory + "_decomission", "hadoop fs -chown -R hdfs:hdfs /" + $scope.modalCommands.hdfsDirectory + "_decomission", "hadoop fs -chmod -R 600 /" + $scope.modalCommands.hdfsDirectory + "_decomission", "<h3>Linux</h3>", "mv " + $scope.modalCommands.lzsDirectory + " " + $scope.modalCommands.lzsDirectory + "_decomission", "chown -R hadoop:hadoop " + $scope.modalCommands.lzsDirectory + "_decomission", "chmod -R 600 " + $scope.modalCommands.lzsDirectory + "_decomission", "<h3>Disable UPSTART Role</h3>"]};
				}
				if(action == 'hardDelete') {
					$scope.modal = {glyphiconText:"console",title:"Hard Delete Script", messageHeader:"Please copy the commands below and run on " + $scope.runOnCluster, messageText:["<h3>HDFS</h3>", "<strong>HDP 2.2:</strong>  hadoop fs -rm -r /" + $scope.modalCommands.hdfsDirectory + "_decomission", "<strong>HDP 1.3:</strong>  hadoop fs -rmr /" + $scope.modalCommands.hdfsDirectory + "_decomission", "<h3>Linux</h3>", "rm -rf " + $scope.modalCommands.lzsDirectory + "_decomission", "<h3>Remove UPSTART Role</h3>", "<h3>Remove LDAP Group</h3>", "<h3>Drop Hive Databases AND Tables</h3>"]};
				}
				$("#statusModal").modal();
			}
			$scope.releaseSubmitLock = function() {
				$scope.submitDisabled = !$scope.submitDisabled;
			}
		} ]);