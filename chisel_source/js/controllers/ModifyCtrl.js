mainRouter.controller('ModifyCtrl', [ '$scope', 'ModelSvc', '$q', 'Api', '$filter','$state',
		function($scope, ModelSvc, $q, Api, $filter, $state) {
			$scope.modifyCtrlSource = ModelSvc.getChosenRequest();
			$scope.workspaces = null;
			$scope.workspace = {};
			$scope.workspace.status = 0;
			$scope.clusterOptions = ModelSvc.getClusterOptions();
			$scope.coeThemeOptions = ModelSvc.getCoeThemes();
			$scope.sourceNames = [];
			$scope.originalSources = [];
			$scope.workspaceCopy = null;
			$scope.statusLegend = ModelSvc.getStatusLegend();
			$scope.legend = ModelSvc.getLegend()[ModelSvc.getUserRole()];
			$scope.saveRequestAsIs = false;
			$scope.coeWorkspaceDecisions = ModelSvc.getCoeWorkspaceDecisions();
			$scope.userRole = ModelSvc.getUserRole();
			if(ModelSvc.getSelectedWorkspace() != null) {
				formatRequestForWorkspace();
			}
			$scope.$on('updateWorkspace', function(ev, option) {
				formatRequestForWorkspace();
		    });
			function formatRequestForWorkspace() {
				setTimeout(function(){
				$scope.saveRequestAsIs = true;
				var tmp = ModelSvc.getSelectedWorkspace();
				$scope.workspace.retirementDate = $filter('date')(tmp.requestDetails.retirementDate, 'yyyy-MM-dd', 'Z');
				$scope.workspace.wsSbUsers = tmp.requestDetails.users;
				$scope.workspace.requestor = tmp.requestDetails.requestor;
				$scope.workspace.hdfsSpaceAllocated = tmp.requestDetails.hdfsCapacity;
				$scope.workspace = tmp.requestDetails.status;
				var tmpcluster = getCluster(tmp.requestDetails.clusterId);
				var tmpwsCoeTheme = getCoeTheme(tmp.requestDetails.coeTheme);
				$scope.workspace = {
						owner:ModelSvc.getUid(),
						rallyId:tmp.requestDetails.rallyId,
						wsRequestType:tmp.wsRequestType,
						requestCreationDate:tmp.requestCreationDate,
						businessName:tmp.requestDetails.businessName,
						initiative:tmp.requestDetails.initiativeName,
						wsRequestId:tmp.wsRequestId,
						wsId:tmp.wsId,
						wsName:tmp.requestDetails.wsName,
						hdfsDirectory:tmp.requestDetails.hdfsDirectory,
						wsRequestGuid:tmp.wsRequestGuid,
						cluster:tmpcluster,
						wsCoeTheme:tmpwsCoeTheme,
						status:tmp.requestDetails.status,
						bdCoeWorkSpace:tmp.requestDetails.bdCoeWorkspace,
						isStageNode:tmp.requestDetails.isStageNode,
						wsOwner:tmp.requestDetails.workspaceOwner,
						requestDetails:tmp.requestDetails,
						retirementDate:$filter('date')(tmp.requestDetails.retirementDate, 'yyyy-MM-dd', 'Z'),wsSbUsers:tmp.requestDetails.users,requestor:tmp.requestDetails.requestor,hdfsSpaceAllocated:tmp.requestDetails.hdfsCapacity,
						requestDetails:tmp.requestDetails,
						wsSbSources:tmp.requestDetails.selectedSources,
						wsSbUsers:tmp.requestDetails.users,
						wsRequestSteps:tmp.wsRequestSteps
				};
				if($scope.workspace.requestDetails.status == 2) {
					$scope.workspace.requestDetails.workspaceConfiguration = {scripts:false};
				}
				$scope.sourceNames = getSourceNames($scope.workspace.cluster.clusterCode);
				doFormatting();
				}, 500);
			}
			$q.all([Api.Workspaces.query({role:ModelSvc.getUserRole(),uid:ModelSvc.getUid()}).$promise]).then(function(result) {
				var temp = [];
				for(var i = 0;i<result[0].length;i++) {
					temp.push(result[0][i]);
				}
				$scope.workspaces = temp;
				for(var i in $scope.workspace.wsSbUsers) {
					$scope.workspace.wsSbUsers[i].action = "keep";
				}
				
				for(var i in $scope.workspaces){
					if($scope.workspaces[i].wsId == $scope.workspace.wsId) {
						$scope.modify = {workspaceName:$scope.workspaces[i]};
					}
				}
				/*$scope.modify = {workspaceName:$scope.workspaces[0]};
				getRequest();*/
			});
			$scope.updateWorkspaceSelection = function() {
				getRequest();
			}
			function getCluster(clusterId) {
			//  Set Cluster Options
				var cluster = null;
				for(var i in ModelSvc.getClusterOptions()) {
					if(clusterId == ModelSvc.getClusterOptions()[i].clusterId) {
						cluster = $scope.clusterOptions[i];
						ModelSvc.setClusterOption(cluster);
					}
				}
				return cluster;
			}
			function getCoeTheme(coeThemeId) {
			//  Set CoE Theme
				var tmp = null;
				for(var i in $scope.coeThemeOptions) {
					if(coeThemeId == $scope.coeThemeOptions[i].wsCoeThemeId) {
						tmp = $scope.coeThemeOptions[i];
					}
				}
				return tmp;
			}
			function getRequest() {
				$q.all([Api.Workspace.query({wsWorkspacesId:$scope.modify.workspaceName.wsWorkspacesId}).$promise]).then(function(result){
					$scope.workspace = result[0];
					$scope.workspace.owner = ModelSvc.getUid();
					$scope.workspace.retirementDate = $filter('date')($scope.workspace.retirementDate, 'yyyy-MM-dd', 'Z');
					$scope.workspace.status = 0;
					$scope.workspace.cluster = getCluster($scope.workspace.clusterId);
					$scope.workspace.wsCoeTheme = getCoeTheme($scope.workspace.wsCoeTheme.wsCoeThemeId);
					$scope.workspace.requestDetails = {};
					$scope.sourceNames = getSourceNames($scope.workspace.cluster.clusterCode);
					$scope.originalSources = $scope.workspace.wsSbSources;
					$scope.workspace.requestor = ModelSvc.getUid();
					$scope.hdfsSpace = result[0].hdfsSpaceAllocated;
				});
			}
			
			$scope.determineSourceAction = function(source, index) {
				var errorString = "#f2dede";
				var successString = "#dff0d8";
				var add = true;
				var style = "";
				for(var i in $scope.workspace.wsSbSources) {
					if($scope.workspace.wsSbSources[i].sourceName == source) {
						if(!("action" in $scope.workspace.wsSbSources[i])) {
							$("#sourceText-" + source).attr("style", "text-decoration:line-through;");
							$scope.workspace.wsSbSources[i] = {sourceName:source,key:index,action:"remove",style:"text-decoration:line-through;"};
							add = false;
						} else {
							$scope.workspace.wsSbSources.splice(i,1);
							$("#sourceText-" + source).attr("style", "color:black;");
							add = false;
						}
					}
				}
				if(add) {
					$scope.workspace.wsSbSources.push({sourceName:source,key:index,action:"add",style:"color:blue;",action:"add"});
					$("#sourceText-" + source).attr("style", "color:blue;");
				}
			}
			
			function getSourceNames(clusterCode) {
				$q.all([Api.Sources.query({cluster:clusterCode}).$promise]).then(function(result){
					$scope.sourceNames = result[0].sort();
					function compare(a,b) {
						  if (a.sourceName < b.sourceName)
						    return -1;
						  if (a.sourceName > b.sourceName)
						    return 1;
						  return 0;
					}
					$scope.sourceNames = $scope.sourceNames.sort(compare);
				});
			}
			
			$scope.initPermissions = function() {
				if(ModelSvc.getUserRole() == "") {
					window.location="/";
				}
			}
			
			$scope.checkSourceChecked = function(source) {
				for(var i in $scope.workspace.wsSbSources) {
					if($scope.workspace.wsSbSources[i].sourceName == source) {
						$("#sourceText-" + source).attr("style", $scope.workspace.wsSbSources[i].style);
						if($scope.workspace.wsSbSources[i].action == "remove") {
							return false;
						} else {
							return true;
						}
					}
				}
				return false;
			}
			
			$scope.userTracker = 0;
			$scope.updateUsers = function updateUsers() {
				//  Needed since we are not starting at [0]
				if($scope.userTracker == 0) {
					$scope.userTracker = $scope.workspace.wsSbUsers.length;
					$scope.userTracker--;
				}
				if($("#user"+$scope.userTracker).val().length > 0) {
					$scope.userTracker++;
					$scope.workspace.wsSbUsers.push({name:'user'+$scope.userTracker,user:'',style:"color:blue;",action:"add"});
					setTimeout(function(){$("#user"+$scope.userTracker).focus();$("#user"+$scope.userTracker).attr("style", "color:blue;");},20);
				} else {
					$("#user"+$scope.userTracker).focus();
				}
			}
			$scope.removeUser = function removeUser(idx) {
				if("style" in $scope.workspace.wsSbUsers[idx]) {
				//  If user was added during modification process, just delete them
					$scope.workspace.wsSbUsers.splice(idx, 1);
					$scope.userTracker--;
				} else {
					$scope.workspace.wsSbUsers[idx].style = "text-decoration:line-through;";
					$scope.workspace.wsSbUsers[idx].action = "remove";
					$("#user"+idx).attr('style', "text-decoration:line-through;");
				}
			}
			
			$scope.scriptsOptionDisabled = true;
			$scope.generateScripts = function() {
				$scope.scriptsOptionDisabled = false;
				$scope.modal = {glyphicon:"glyphicon glyphicon-ok",title:"Execute the Following Scripts",topText:"Quota Change",bodyText:[]};
				$scope.modal.bodyText.push("dfsadmin -clrSpaceQuota " + $scope.workspace.hdfsDirectory);
				$scope.modal.bodyText.push("dfsadmin -setSpaceQuota " + $scope.workspace.requestDetails.hdfsCapacity);
				$("#statusModal").modal();
			}
			
			$scope.reset = function() {
				window.location = "/";
			}
			
			$scope.saveRequest = function(formStep) {
				for(var i in $scope.workspace.wsSbUsers) {
					if("action" in $scope.workspace.wsSbUsers[i]) {
						//  nothing
					} else {
						$scope.workspace.wsSbUsers[i].action = "keep";
					}
				}
				for(var i in $scope.workspace.wsSbSources) {
					if("action" in $scope.workspace.wsSbSources[i]) {
						//  nothing
					} else {
						$scope.workspace.wsSbSources[i].action = "keep";
					}
				}
				if(!$scope.saveRequestAsIs) {
					//  Now form like WsRequest
					var request = new Object();
					request.requestDetails = {workspaceOwner:$scope.workspace.wsOwner,requestor:ModelSvc.getUid(),status:formStep,clusterId:$scope.workspace.clusterId,coeTheme:$scope.workspace.wsCoeTheme.wsCoeThemeId,initiativeName:$scope.workspace.initiative,users:JSON.parse(angular.toJson($scope.workspace.wsSbUsers)),selectedSources:JSON.parse(angular.toJson($scope.workspace.wsSbSources)),retirementDate:$scope.workspace.retirementDate,requestor:$scope.workspace.requestor,hdfsCapacity:$scope.workspace.hdfsSpaceAllocated,hdfsCapacityChanged:$scope.workspace.requestDetails.hdfsCapacityChanged,isStageNode:$scope.workspace.isStageNode,bdCoeWorkspace:$scope.workspace.bdCoeWorkSpace,pmt:$scope.workspace.pmt,wsName:$scope.workspace.wsName,hdfsDirectory:$scope.workspace.hdfsDirectory,businessName:$scope.workspace.businessName,rallyId:$scope.workspace.rallyId};
					request.requestTypeId = 2;
					request.wsRequestType = {requestTypeId:2};
					request.wsRequestGuid = 0;
					request.wsRequestSteps = [];
					request.wsRequestorAttuid = ModelSvc.getUid();
					request.wsId = $scope.workspace.wsId;
					request.initiative = $scope.workspace.initiative;
					request.wsRequestId = $scope.workspace.wsRequestId;
					request.step = formStep;
					if(formStep == 0) {
						request.requestDetails.status = formStep;
						//request.wsRequestSteps.push({wsSteps:{wsStepsId:5},wsStatus:{statusId:3},statusComments:'Saved as draft by ' + ModelSvc.getUid(),user:ModelSvc.getUid()});
					}
					if(formStep == 1) {
						request.requestDetails.status = formStep;
						//request.wsRequestSteps.push({wsSteps:{wsStepsId:1},wsStatus:{statusId:3},statusComments:'Submitted by ' + ModelSvc.getUid() + ' for CoE review',user:ModelSvc.getUid()});
					}
					if(formStep == 2) {
						request.requestDetails.status = formStep;
						request.requestDetails.coeStatus = {"decisionStatus":{"label":"Approve","value":1},"statusComments":"Approved"};
						//request.wsRequestSteps.push({wsSteps:{wsStepsId:2},wsStatus:{statusId:3},statusComments:'Submitted by CoE Approver ' + ModelSvc.getUid(),user:ModelSvc.getUid()});
					}
					if(formStep == 2 && ModelSvc.getUserRole() == "WSCOES") {
						request.requestDetails.status = formStep;
						request.coeDecision = 1;
						//request.wsRequestSteps.push({wsSteps:{wsStepsId:2},wsStatus:{statusId:3},statusComments:'Submitted and approved ' + ModelSvc.getUid() + ' for CoE review',user:ModelSvc.getUid()});
					}
					request.requestDetails = JSON.stringify(request.requestDetails);
					if(formStep == 0 || formStep == 1) {
						$("[name=" + ModelSvc.getUserRole() + "-save]").prop('disabled', true);
						$("[name=" + ModelSvc.getUserRole() + "-submit]").prop('disabled', true);
						$q.all([Api.Requests.save(request).$promise]).then(function(result) {
							$q.all([Api.Requests.query({uid:ModelSvc.getUid(),role:ModelSvc.getUserRole()}).$promise]).then(function(result) {
								ModelSvc.setUserRequests(JSON.parse(angular.toJson(result[0])));
							});
						});
					}
					if(formStep == 2) {
						Api.RequestModifySteps.save(request);
					}
					$scope.modal = {glyphicon:"glyphicon glyphicon-ok",title:"Saving",topText:"Saving your workspace!"};
				} else {
					var request = {};
					request.wsRequestId = $scope.workspace.wsRequestId;
					request.requestTypeId = 2;
					request.wsRequestType = $scope.workspace.wsRequestType;
					request.wsRequestSteps = [];
					request.wsId = $scope.workspace.wsId;
					request.initiative = $scope.workspace.initiative;
					request.wsRequestorAttuid = $scope.workspace.requestor;
					request.requestCreationDate = $scope.workspace.requestCreationDate;
					request.wsRequestGuid = $scope.workspace.wsRequestGuid;
					var requestDetails = $scope.workspace.requestDetails;
					requestDetails.hdfsCapacity = $scope.workspace.hdfsSpaceAllocated;
					requestDetails.users = JSON.parse(angular.toJson($scope.workspace.wsSbUsers));
					requestDetails.selectedSources = JSON.parse(angular.toJson($scope.workspace.wsSbSources));
					requestDetails.status = formStep;
					request.wsRequestSteps = $scope.workspace.wsRequestSteps;
					if(requestDetails.hdfsCapacity > 100000) {
						requestDetails.hdfsCapacity = 100000;
					}
					request.step = formStep;
					if(request.step == 0) {
						//request.wsRequestSteps = [{wsSteps:{wsStepsId:5},wsStatus:{statusId:3},statusComments:'Saved as draft by ' + ModelSvc.getUid(),user:ModelSvc.getUid()}];
						$scope.modal = {glyphicon:"glyphicon glyphicon-ok",title:"Saving",topText:"Saving your workspace!"};
					}
					if(request.step == 1) {
						//request.wsRequestSteps.push({wsSteps:{wsStepsId:1},wsStatus:{statusId:3},statusComments:'Submitted for CoE Review by ' + ModelSvc.getUid(),user:ModelSvc.getUid()});
						if(typeof requestDetails.coeStatus == "undefined" || requestDetails.coeStatus.decisionStatus.value == 2) {
							requestDetails.coeStatus = {"decisionStatus":{"label":"","value":3},"statusComments":"Pending"};
						}
						$scope.modal = {glyphicon:"glyphicon glyphicon-ok",title:"Submitted Successfully",topText:"Submitting your workspace!"};
					}
					if(request.step == 2) {
						requestDetails.coeStatus = $scope.workspace.requestDetails.coeStatus;
						request.coeDecision = $scope.workspace.requestDetails.coeStatus.decisionStatus.value;
						if(request.coeDecision < 3) {
							requestDetails.coeStatus = $scope.workspace.requestDetails.coeStatus;
							request.coeDecision = $scope.workspace.requestDetails.coeStatus.decisionStatus.value;
							$scope.modal = {glyphicon:"glyphicon glyphicon-ok",title:"Submitted Successfully",topText:"Thank you for your review!"};
							if(request.coeDecision == 2) {
								requestDetails.status = 0;
							}
							request.requestDetails = JSON.stringify(requestDetails);
							Api.RequestModifySteps.save(request);
						} else {
							$scope.modal = {glyphicon:"glyphicon glyphicon-remove",title:"Decision Needed",topText:"Please make a decision aside from " + $scope.workspace.requestDetails.coeStatus.decisionStatus.label};
						}
					}
					if(request.step == 3) {
						if(typeof $scope.hadoopAdminDecision == "undefined") {
							$("#WSHAdecision").parent().parent().attr('class', 'form-group has-error');
							$scope.modal = {glyphicon:'glyphicon glyphicon-remove', title:"Decision Needed", topText:"Please make a decision to Approve/Reject"};
						} else {
							if($scope.hadoopAdminDecision.decisionObject.value == 2) {
								$scope.modal = {glyphicon:'glyphicon glyphicon-ok', title:"Modification Rejected", topText:"Workspace was not modified and requestor has been notified."};
								request.step = 2;
								if(typeof requestDetails == "string") {
									requestDetails = JSON.parse(requestDetails);
								}
								requestDetails.status = 0;
								requestDetails.hadoopAdminDecision = $scope.hadoopAdminDecision;
								request.requestDetails = JSON.stringify(requestDetails);
								Api.RequestModifySteps.save(request);
							} else {
								if($scope.request.requestDetails.hadoopAdminDecision.decisionObject.value == 1) {
									if($scope.workspace.requestDetails.workspaceConfiguration.scripts) {
										request.step = 3;
										$scope.modal = {glyphicon:"glyphicon glyphicon-ok",title:"Sandbox Created Successfully",topText:"Provisioned!"};
										request.hdfsSpaceAllocated = $scope.workspace.hdfsSpaceAllocated;
										Api.RequestModifySteps.save(request);
									} else {
										$scope.modal = {glyphicon:"glyphicon glyphicon-remove",title:"Sandbox Creation Error",topText:"Please execute scripts!"};
									}
								} else {
									//console.log();
								}
							}
						}
					}
					request.requestDetails = JSON.stringify(requestDetails);
					if(request.step ==0 || request.step == 1) {
						$("[name=" + ModelSvc.getUserRole() + "-save]").prop('disabled', true);
						$("[name=" + ModelSvc.getUserRole() + "-submit]").prop('disabled', true);
						$q.all([Api.Requests.save(request).$promise]).then(function(result) {
							$q.all([Api.Requests.query({uid:ModelSvc.getUid(),role:ModelSvc.getUserRole()}).$promise]).then(function(result) {
								ModelSvc.setUserRequests(JSON.parse(angular.toJson(result[0])));
							});
						});
					}
				}
				$("#statusModal").modal();
			}
			$scope.detectChange = function() {
				if($scope.hdfsSpace != $scope.workspace.hdfsSpaceAllocated) {
					$("[name=capacity]").attr('style', "color:blue;");
					$scope.workspace.requestDetails.hdfsCapacityChanged = true;
				} else {
					$("[name=capacity]").attr('style', "color:#000;");
					$scope.workspace.requestDetails.hdfsCapacityChanged = false;
				}
			}
			function finish(){
				$('#retireBy').datepicker({
					autoclose : true,
					format : "yyyy-mm-dd"
				});
				if(ModelSvc.getUserRole() == "WSRequestors" || ModelSvc.getUserRole() == "WSCOES" || ModelSvc.getUserRole() == "WSEveryone") {
					$scope.legend.formValues['requestDetailsFormPermission'] = false;
					if("requestDetails"  in $scope.workspace && $scope.workspace.requestDetails.status > 0 && ModelSvc.getUserRole() == "WSRequestors") {
						$("[name=" + ModelSvc.getUserRole() + "-save]").prop('disabled', true);
						$("[name=" + ModelSvc.getUserRole() + "-submit]").prop('disabled', true);
					}
				}
			}
			
			setTimeout(function() {
			if(ModelSvc.getUserRole() == "WSCOMPLIANCE") {
				$("[name=" + ModelSvc.getUserRole() + "-submit]").prop('disabled', true);
			}if(ModelSvc.getUserRole() == "WSHA") {$("#WSHAdecision").prop('disabled', false);$("#WSHAcomments").prop('disabled', false);}}, 1000);
			
			function doFormatting() {
				setTimeout(function(){
				//  Formatting changes
				if($scope.workspace.requestDetails.hdfsCapacityChanged) {
					$("[name=capacity]").attr("style", "color:blue;");
				}
				for(var i in $scope.workspace.wsSbUsers) {
					if("style" in $scope.workspace.wsSbUsers[i]) {
						$("#user"+i).attr("style", $scope.workspace.wsSbUsers[i].style);
					}
				}}, 2000);
			}
			setTimeout(finish, 2000);
			$scope.initPermissions();
			
			$scope.changeRDCaret = function() {
				$scope.legend.accordionViews.requestDetailsArea.downCaret = !$scope.legend.accordionViews.requestDetailsArea.downCaret;
			}
			$scope.changeCOECaret = function() {
				$scope.legend.accordionViews.coeReviewArea.downCaret = !$scope.legend.accordionViews.coeReviewArea.downCaret;
			}
			$scope.changeHACaret = function() {
				$scope.legend.accordionViews.hadoopAdminArea.downCaret = !$scope.legend.accordionViews.hadoopAdminArea.downCaret;
			}
		} ]);