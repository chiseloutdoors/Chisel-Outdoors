mainRouter
		.controller(
				'CreateCtrl',
				[
						'$scope',
						'ModelSvc',
						'Api',
						'$q',
						'$modal',
						'$filter',
						'$state',
						function($scope, ModelSvc, Api, $q, $modal, $filter, $state) {
							if(ModelSvc.getUserRole() == "") {
								window.location = "/";
							}
							//  Form accessories
							$scope.sourceNames = null;
							$scope.forceSave = 0;
							$scope.selectedSources = [];
							$scope.sourceSelected = "";
							$scope.oneAtATime = true;
							$scope.legend = ModelSvc.getLegend()[ModelSvc.getUserRole()];
							var needByDate = ModelSvc.getCustomDate(8);
							$scope.coeThemes = ModelSvc.getCoeThemes();
							$scope.clusterOptions = ModelSvc.getClusterOptions();
							$scope.statusLegend = ModelSvc.getStatusLegend();
							$scope.userRole = ModelSvc.getUserRole();
							var clusterOption = ModelSvc.getClusterOption();
							$scope.coeWorkspaceDecisions = ModelSvc.getCoeWorkspaceDecisions();
							var workspaceConfiguration = {
									technicalName:"",
									ldapName:"",
									upstartName:"",
									hdfsDirectory:"",
									landingZone:"",
									stagingNode:"",
									executedScripts:false,
									upstartRolesDefined:false,
									workspaceReady:false
								};
							$scope.upstartApprovers = null;
							$q.all([Api.WsConfiguration.query().$promise]).then(function(result) {
								var size = result[0].length;
								$scope.upstartApprovers = "";
								for(var i in result[0]) {
									if(typeof result[0][i].property === "undefined") {
									} else {
										if(result[0][i].property == "upstart.approver") {
											$scope.upstartApprovers += result[0][i].value;
										}
									}
									if(i < size && typeof result[0][i+1] != "undefined") {
										$scope.upstartApprovers += ",";
									}
								}
							});
							var requestDetails = {workspaceOwner:ModelSvc.getUid(),pmt:'',status:0,users:[{name:'user0',user:""}],upstartApprovers:[{name:'approver0',user:""}],coeWorkspace:'true',hdfsCapacity:10,retirementDate:ModelSvc.getCustomDate(374),cluster:clusterOption,liveSnapshotSelected:'',stageNode: 'shared',coeStatus:{decisionStatus:$scope.coeWorkspaceDecisions[2],statusComments:"Pending"},workspaceConfiguration:workspaceConfiguration,hadoopAdminDecision:{decisionObject:$scope.coeWorkspaceDecisions[2],comments:""}};
							if(ModelSvc.getRequestIdentifier() != null && ModelSvc.getRequestIdentifier() != 0) {
								$q.all([ModelSvc.getChosenRequest().$promise]).then(function(result) {
									formatRequest();
								});
							} else {
								$scope.request = {neededByDate:needByDate,requestDetails:requestDetails};
								enableDisableFields(ModelSvc.getUserRole(), true);
							}
							$scope.reqClear = $scope.request;
							
							if(ModelSvc.getSourceNames() == null) {
								if(!ModelSvc.getSourceNameOptionsSet()) {
									getSourceNames();
								}
							}
							if(ModelSvc.getCoeThemes() == null) {
								$q.all([Api.CoEThemes.query().$promise]).then(function(result) {
									$scope.coeThemes = result[0];
								});
							}
							if(ModelSvc.getClusterOptions() == null) {
								$q.all([Api.Clusters.query().$promise]).then(function(result) {
									$scope.clusterOptions = result[0];
								});
							}
							function getSourceNames() {
								var tempArr = [];
								if(ModelSvc.getClusterOption() != null) {
									$q.all([Api.Sources.query({cluster:ModelSvc.getClusterOption().clusterCode}).$promise,Api.BusinessNames.query().$promise]).then(function(result) {
										for(var i =0;i<result[0].length;i++) {
							    			tempArr.push(result[0][i]);
							    		}
										function compare(a,b) {
											  if (a.sourceName < b.sourceName)
											    return -1;
											  if (a.sourceName > b.sourceName)
											    return 1;
											  return 0;
										}
										tempArr = tempArr.sort(compare);
							    		ModelSvc.setSourceNames(tempArr);
							    		$scope.sourceNames = tempArr;
							    		$scope.businessNames = result[1];
							    	});
								}
							}
							
							$scope.copyText = function() {
								$scope.modalTitle = "Copy";
								$scope.glyphiconText = "copy";
								$scope.modalMessageHeader = "Please copy the text below";
								$scope.modalMessageText = $scope.request.requestDetails.initiativeDetails;
								$("#myModal").modal();
							}
							
							$scope.pushSource = function(sourceName, key) {
								var temp = {
										source:sourceName,key:key,action:"add"
								};
								if($scope.selectedSources.length == 0) {
                  $scope.sourceSelected = true;
									$scope.selectedSources.push(temp);
								} else {
									var found = false;
									for(var i in $scope.selectedSources) {
										if($scope.selectedSources[i].source == sourceName) {
											$scope.selectedSources.splice(i, 1);
											found = true;
										}
									}
									if(found) {
									} else {
                    $scope.sourceSelected = true;
										$scope.selectedSources.push(temp);
									}
								}
								
								if ($scope.selectedSources.length == 0) {
                  $scope.sourceSelected = "";
								}
							}
							$scope.checkSourceChecked =function(source){
								var checked = false;
								for(var i in $scope.selectedSources) {
									if($scope.selectedSources[i].source == source) {
									  $scope.sourceSelected = true;
										checked = true;
									}
								}
								return checked;
							}
							
						  $scope.$on('setClusterOption', function(ev, option) {
						    $scope.request.requestDetails.cluster = option;
						    for(var i in $scope.clusterOptions) {
						    	if($scope.clusterOptions[i].clusterCode == $scope.request.requestDetails.cluster.clusterCode) {
						    		$scope.request.requestDetails.cluster = $scope.clusterOptions[i];
						    	}
						    }
						    getSourceNames();
						  });
						  $scope.$on('clearSelectedSources', function() {
							    $scope.selectedSources = [];
						});
						$scope.$on('updateRequestIdentifier', function(ev, option) {
							  ModelSvc.setChosenRequest(Api.Requests.oneRequest({rid:option}));
							  $q.all([ModelSvc.getChosenRequest().$promise]).then(function(result) {
									formatRequest();
							  });
						  });
						  
						$scope.changeClusterName = function() {
							ModelSvc.setClusterOption($scope.request.requestDetails.cluster);
						}
						  
						function enableDisableFields(fieldName, action) {
							setTimeout(function(){
							$("[name=" + fieldName + "]").each(function(){
								  $(this).prop('disabled', action);
							  });}, 1000);
						}
						
						function disableFields(fieldsToDisable) {
							setTimeout(function(){
								for(var i in fieldsToDisable) {
									$("[name=" + fieldsToDisable[i] + "]").each(function(){
										$(this).prop('disabled', true);
									});
								}
							}, 1000);
						}
						function enableFields(fieldsToEnable) {
							setTimeout(function(){
								for(var i in fieldsToEnable) {
									$("[name=" + fieldsToEnable[i] + "]").each(function(){
										$(this).prop('disabled', false);
									});
								}
							}, 1000);
						}
						
						  function formatRequest() {
							if(ModelSvc.getChosenRequest()[0] != null) {
								$scope.showRequestMessage = false;
								if("requestDetails" in ModelSvc.getChosenRequest()[0]) {
									  $scope.request = ModelSvc.getChosenRequest()[0];
										$scope.request.requestDetails = JSON.parse($scope.request.requestDetails);
										$scope.sourceNames = Api.Sources.query({cluster:$scope.request.requestDetails.cluster.clusterCode});
										$scope.selectedSources = $scope.request.requestDetails.selectedSources;
										if(!"coeStatus" in $scope.request.requestDetails) {
											$scope.request.requestDetails.coeStatus = {decisionStatus:$scope.coeWorkspaceDecisions[0],statusComments:""};
										}
										$scope.request.neededByDate = $filter('date')($scope.request.neededByDate, 'yyyy-MM-dd', 'Z');
										if("cluster" in $scope.request.requestDetails && "liveSnapshotSelected" in $scope.request.requestDetails) {
											ModelSvc.setClusterOption($scope.request.requestDetails.cluster);
											$scope.sourceTablesOptions = Api.SourceTables.query({cluster:$scope.request.requestDetails.cluster.clusterCode,source:$scope.request.requestDetails.liveSnapshotSelected});
										}
										//  Choose cluster
										for(var i in $scope.clusterOptions) {
											if($scope.clusterOptions[i].clusterCode == $scope.request.requestDetails.cluster.clusterCode) {
												$scope.request.requestDetails.cluster = $scope.clusterOptions[i];
											}
										}
										
										//  Set a CoE choice
										if($scope.request.requestDetails.coeStatus.decisionStatus != null) {
											for(var i in $scope.coeWorkspaceDecisions) {
												if($scope.request.requestDetails.coeStatus.decisionStatus.value == $scope.coeWorkspaceDecisions[i].value) {
													$scope.request.requestDetails.coeStatus.decisionStatus = $scope.coeWorkspaceDecisions[i];
												}
											}
										}
										if(ModelSvc.getUserRole() == "WSHA") {
											$scope.request.requestDetails.workspaceConfiguration.technicalName = "sandbox";
											$scope.request.requestDetails.workspaceConfiguration.technicalNameVersion = "<x>";
											$q.all([Api.WorkspaceNames.query().$promise]).then(function(result){
												var recommended = 0;
												for(var i in result[0]) {
													if(typeof result[0][i] === "string" && result[0][i].replace(/[^0-9]/g, '') > 0) {
														recommended = parseFloat(result[0][i].replace(/[^0-9]/g, '')) + 1;
													}
												}
												if(recommended == 0) {
													recommended += 1;
												}
												$scope.request.requestDetails.workspaceConfiguration.technicalNameVersion = recommended;
												$scope.request.requestDetails.workspaceConfiguration.technicalName = $scope.request.requestDetails.workspaceConfiguration.technicalName + recommended;
												$scope.changeLdapName();
											});
											$scope.changeLdapName = function() {
												if($scope.request.requestDetails.workspaceConfiguration.technicalNameVersion) {
													var newName = $scope.request.requestDetails.workspaceConfiguration.technicalName;
													var numbers = newName.replace(/[^0-9]/g, '');
													$scope.request.requestDetails.workspaceConfiguration.ldapName = "snbx" + numbers;
													$scope.request.requestDetails.workspaceConfiguration.upstartName = "Datalake " + $scope.request.requestDetails.cluster.clusterName + " " + capitalizeFirstLetter($scope.request.requestDetails.workspaceConfiguration.technicalName);
													$scope.request.requestDetails.workspaceConfiguration.hdfsDirectory = "sandbox/" + $scope.request.requestDetails.workspaceConfiguration.technicalName;
													$scope.request.requestDetails.workspaceConfiguration.landingZone = "/opt/data/stage01/" + $scope.request.requestDetails.workspaceConfiguration.technicalName;
													$scope.request.requestDetails.workspaceConfiguration.stagingNode = $scope.request.requestDetails.cluster.defaultStagingNode;
												}
											}
										}
										if(ModelSvc.getUserRole() == "WSCOES" || ModelSvc.getUserRole() == "WSHA") {
											enableFields([ModelSvc.getUserRole(),ModelSvc.getUserRole() + "-submit"]);
										}
										if(ModelSvc.getUserRole() == "WSRequestors" && $scope.request.requestDetails.status > 0) {
											disableFields([ModelSvc.getUserRole(),ModelSvc.getUserRole() + "-submit"]);
										}
								  } else {
									  $scope.request = {neededByDate:needByDate,requestDetails:requestDetails};
								  }
							  } else {
								  $scope.request = {neededByDate:needByDate,requestDetails:requestDetails};
							  }
						  }
							
							$scope.userTracker = 0;
							$scope.updateUsers = function updateUsers() {
								if($("#user"+$scope.userTracker).val().length > 0) {
									$scope.userTracker++;
									$scope.request.requestDetails.users.push({name:'user'+$scope.userTracker,user:''});
									setTimeout(function(){$("#user"+$scope.userTracker).focus();},20);
								} else {
									$("#user"+$scope.userTracker).focus();
								}
							}
              $scope.removeUser = function removeUser(idx) {
                $scope.request.requestDetails.users.splice(idx, 1);
                $scope.userTracker--;
                if($scope.userTracker == -1) {
                  $scope.userTracker++;
                  $scope.request.requestDetails.users.push({name:'user'+$scope.userTracker,user:''});
                  setTimeout(function(){$("#user"+$scope.userTracker).focus();},20);
                }
              }
							
							$scope.approverTracker = 0;
							$scope.updateUpstartApprovers = function updateUpstartApprovers() {
								if($("#approver"+$scope.approverTracker).val().length > 0) {
									$scope.approverTracker++;
									$scope.request.requestDetails.upstartApprovers.push({name:'approver'+$scope.approverTracker,user:''});
									setTimeout(function(){$("#approver"+$scope.approverTracker).focus();},20);
								} else {
									$("#approver"+$scope.approverTracker).focus();
								}
							}
				$scope.removeUpstartUser = function removeUser(idx) {
                $scope.request.requestDetails.upstartApprovers.splice(idx, 1);
                $scope.approverTracker--;
                if($scope.approverTracker == -1) {
                  $scope.approverTracker++;
                  $scope.request.requestDetails.upstartApprovers.push({name:'approver'+$scope.approverTracker,user:''});
                  setTimeout(function(){$("#approver"+$scope.approverTracker).focus();},20);
                }
              }
							//  WsRequest
							//  Update dates
							$scope.reset = function reset() {
								var requestDetails = {pmt:'',status:'',users:[{name:'user0',user:""}],upstartApprovers:[{name:'approver0',user:""}],coeWorkspace:'false',hdfsCapacity:10,retirementDate:ModelSvc.getCustomDate(374),status:"Draft",coeStatus:ModelSvc.getCoeWorkspaceDecisions()[2],hadoopAdminDecision:{decisionObject:$scope.coeWorkspaceDecisions[2],comments:""}};
								$scope.request = {neededByDate:needByDate,requestDetails:requestDetails};
								window.location = "/";
							}
							$scope.forceSaveInit = function(requestVersion) {
								$scope.forceSave = 1;
								$scope.saveRequest(requestVersion);
							}
							$scope.saveRequest = function saveRequest(requestVersion) {
								var tmpRequestDetails = {initiativeName:'Init name'};
								if(requestVersion == 1 || requestVersion == 0) {
									var cpy = $scope.request;
									var statusComments = ["Created Request Draft", "Submitted Request"];
									cpy.requestTypeId = 1;
									cpy.step = requestVersion;
									cpy.wsRequestorAttuid = ModelSvc.getUid();
									cpy.requestDetails.status = requestVersion;
									cpy.requestDetails.selectedSources = $scope.selectedSources;
									cpy.requestName = cpy.requestDetails.initiativeName;
									cpy.requestDetails.coeStatus.decisionStatus = $scope.coeWorkspaceDecisions[2];
									//cpy.requestDetails.coeStatus = $scope.coeWorkspaceDecisions[2];
									cpy.initiative = cpy.requestDetails.initiativeName;
									if(requestVersion == 0) {
										$scope.modalTitle = "Draft Saved";
										$scope.glyphiconText = "pencil";
										$scope.modalMessageHeader = "Draft Saved";
										$scope.modalMessageText = "Your draft was successfully saved.";
										if("wsRequestSteps" in cpy) {
											// do nothing
										} else {
											cpy.wsRequestSteps = [{statusComments:statusComments[requestVersion],wsSteps:{wsStepsId:5},wsStatus:{statusId:3},user:ModelSvc.getUid()}];
										}
									} else {
										$scope.modalTitle = "Workspace Request Submitted";
										$scope.glyphiconText = "ok";
										$scope.modalMessageHeader = "Request Submitted";
										$scope.modalMessageText = "Your request was submitted successfully and will be reviewed shortly.";
										if("wsRequestSteps" in cpy) {
											//cpy.wsRequestSteps.push({statusComments:statusComments[requestVersion],wsSteps:{wsStepsId:1},wsStatus:{statusId:3},user:ModelSvc.getUid()});
										} else {
											cpy.wsRequestSteps = [];
											cpy.wsRequestSteps.push({statusComments:statusComments[requestVersion],wsSteps:{wsStepsId:1},wsStatus:{statusId:3},user:ModelSvc.getUid()});
										}
									}
									if(cpy.requestDetails.cluster == null || typeof cpy.requestDetails.initiativeName == 'undefined' || cpy.requestDetails.initiativeName.length == 0 || cpy.requestDetails.selectedSources.length == 0 && requestVersion == 1 && $scope.forceSave == 0) {
										if(cpy.requestDetails.selectedSources.length == 0) {
											$scope.modalTitle = "Warning";
											$scope.glyphiconText = "warning-sign";
											$scope.modalMessageHeader = "Absent Sources";
											$scope.modalMessageText = "You are about to submit a request with no sources.";
											$("#absentSourcesModal").modal();
										} else {
											$scope.modalTitle = "Error";
											$scope.glyphiconText = "remove";
											$scope.modalMessageHeader = "Error in Form";
											$scope.modalMessageText = "There was an error saving your request, please ensure all required fields are filled.";
											$("#myModal").modal();
											ModelSvc.setChosenRequest(cpy);
											formatRequest();
										}
									} else {
										$("#absentSourcesModal").modal('hide');
										cpy.requestDetails = angular.toJson(cpy.requestDetails);
										cpy.step = requestVersion;
										$q.all([Api.Requests.save(cpy).$promise]).then(function(result) {
											//  Update lists
											result[0].requestDetails = JSON.parse(result[0].requestDetails);
											var updatedRequests = ModelSvc.getUserRequests();
											
										//  check if item is in list
											for(var i in updatedRequests) {
												if(updatedRequests[i].wsRequestGuid == cpy.wsRequestGuid) {
													updatedRequests.splice(i, 1);
												}
											}
											
											//  now push item
											updatedRequests.push(result[0]);
											ModelSvc.setUserRequests(updatedRequests);
											
											ModelSvc.setChosenRequest(result[0]);
											formatRequest();
											$scope.request = result[0];
											$scope.request.neededByDate = $filter('date')(result[0].neededByDate, 'yyyy-MM-dd', 'Z');
											if(typeof result[0].requestDetails === "string") {
												$scope.request.requestDetails = JSON.parse(result[0].requestDetails);
											}
										});
										$("#myModal").modal();
									}
								}
								if(requestVersion == 2) {
									var decisionStatusValue = $scope.request.requestDetails.coeStatus.decisionStatus.value;
									var coeStatusComments = $scope.request.requestDetails.coeStatus.statusComments;
									if(decisionStatusValue < 3) {
										$scope.request.coeDecision = $scope.request.requestDetails.coeStatus.decisionStatus.value;
										$scope.glyphiconText = "ok";
										$scope.modalTitle = "Decision Submitted";
										$scope.modalMessageHeader = "Decision Submitted";
										$scope.modalMessageText = "Thank you for your review of " + $scope.request.requestDetails.initiativeName;
										$scope.request.requestDetails.status = 2;
										$scope.request.step = 2;
										if(decisionStatusValue == 1) {
											$scope.request.wsRequestSteps.push({statusComments:coeStatusComments,wsSteps:{wsStepsId:2},wsStatus:{statusId:decisionStatusValue},user:ModelSvc.getUid(),date:ModelSvc.getCustomDate(0)});
										} else {
											$scope.request.requestDetails.status = 0;
											$scope.request.wsRequestSteps.push({statusComments:coeStatusComments,wsSteps:{wsStepsId:2},wsStatus:{statusId:decisionStatusValue},user:ModelSvc.getUid(),date:ModelSvc.getCustomDate(0)});
										}
										$scope.request.requestDetails = angular.toJson($scope.request.requestDetails);
										Api.RequestSteps.save($scope.request);
										//  Now update list
										var requestsArray = ModelSvc.getUserRequests();
										for(var i in requestsArray) {
											if(requestsArray[i].wsRequestGuid == $scope.request.wsRequestGuid) {
												requestsArray.splice(i, 1);
											}
										}
										ModelSvc.setUserRequests(requestsArray);
										$("#myModal").modal();
										disableFields([ModelSvc.getUserRole() + "-save", ModelSvc.getUserRole() + "-submit", ModelSvc.getUserRole()]);
										$scope.request = {neededByDate:needByDate,requestDetails:requestDetails};
										$scope.request.neededByDate = $filter('date')($scope.request.neededByDate, 'yyyy-MM-dd', 'Z');
										setTimeout(function(){
										$(".form-group").each(function(){
											$(this).removeClass("has-error");
										});$(".errortxt").hide();}, 2000);
									} else {
										$scope.glyphiconText = "remove";
										$scope.modalTitle = "Decision Required";
										$scope.modalMessageHeader = "Decision is needed";
										$scope.modalMessageText = "Please make a decision aside from:  " + $scope.coeWorkspaceDecisions[2].label;
										$("#myModal").modal();
									}
								}
								if(requestVersion == 3) {
									if(typeof $scope.request.requestDetails.hadoopAdminDecision == "undefined") {
										$("#" + ModelSvc.getUserRole() + "decision").parent().parent().attr("class", "form-group has-error");
										$scope.glyphiconText = "remove";
										$scope.modalTitle = "Workspace Not Submitted";
										$scope.modalMessageHeader = "Workspace Not Created";
										$scope.modalMessageText = "Workspace requires a decision to be submitted.";
										$("#myModal").modal();
									} else {
										if($scope.request.requestDetails.hadoopAdminDecision.decisionObject.value == 2) {
											console.log("It was rejected");
											$scope.glyphiconText = "ok";
											$scope.modalTitle = "Workspace Denied";
											$scope.modalMessageHeader = "Workspace Not Created";
											$scope.modalMessageText = "Workspace has not been created and requestor was notified.";
											$("#myModal").modal();
											$scope.request.step = 2;
											$scope.request.requestDetails.status = 0;
											$scope.request.coeDecision = 2;
											$scope.request.requestDetails = JSON.stringify($scope.request.requestDetails);
											Api.RequestSteps.save($scope.request);
										} else {
											if($scope.request.requestDetails.workspaceConfiguration.executedScripts == true && $scope.request.requestDetails.workspaceConfiguration.upstartRolesDefined && $scope.request.requestDetails.workspaceConfiguration.workspaceReady == true) {
												if($scope.request.requestDetails.hadoopAdminDecision.decisionObject.value == 1) {
													$scope.request.step = 3;
													$scope.request.requestDetails.status = 3;
													
													$scope.request.isBdCoeWorkspace = $scope.request.requestDetails.coeWorkspace;
													$scope.request.initiative = $scope.request.requestDetails.initiativeName;
													$scope.request.initiativeDetails = $scope.request.requestDetails.initiativeDetails;
													$scope.request.retirementDate = $scope.request.requestDetails.retirementDate;
													$scope.request.wsOwner = $scope.request.requestDetails.workspaceOwner;
													$scope.request.businessName = $scope.request.requestDetails.businessName;
													if($scope.request.requestDetails.stageNode == "shared") {
														$scope.request.isStageNode = true;
													} else {
														$scope.request.isStageNode = false;
													}
													$scope.request.hdfsSpaceAllocated = $scope.request.requestDetails.hdfsCapacity;
													$scope.request.lzSpaceAllocated = 20;
													$scope.request.pmt = $scope.request.requestDetails.pmt;
													$scope.request.wsName = $scope.request.requestDetails.workspaceConfiguration.technicalName;
													$scope.request.ldapGroupName = $scope.request.requestDetails.workspaceConfiguration.ldapName;
													$scope.request.upstartRoleName = $scope.request.requestDetails.workspaceConfiguration.upstartName;
													$scope.request.hdfsDirectory = $scope.request.requestDetails.workspaceConfiguration.hdfsDirectory;
													$scope.request.lzsDirectory = $scope.request.requestDetails.workspaceConfiguration.landingZone;
													$scope.request.clusterId = $scope.request.requestDetails.cluster.clusterId;
													$scope.request.stageNode = $scope.request.requestDetails.workspaceConfiguration.stagingNode;
													$scope.request.users = [];
													for(var i in $scope.request.requestDetails.users) {
														$scope.request.users.push($scope.request.requestDetails.users[i].user);
													}
													$scope.request.wsRequestSteps.push({statusComments:$scope.request.requestDetails.coeStatus.statusComments,wsSteps:{wsStepsId:3},wsStatus:{statusId:$scope.request.requestDetails.coeStatus.decisionStatus.value},user:ModelSvc.getUid(),date:ModelSvc.getCustomDate(0)});
													$scope.glyphiconText = "ok";
													$scope.modalMessageHeader = "Workspace Provisioned";
													$scope.modalMessageText = "Workspace has been provisioned, thank you!";
													$("#myModal").modal();
													$scope.saveHAProvision = true;
													$scope.requestDetailsCopy = $scope.request.requestDetails;
													$q.all([Api.WorkspaceNames.query().$promise]).then(function(result){
														for(var i in result[0]) {
															if(typeof result[0][i] === "string" && result[0][i].replace(/[^0-9]/g, '') == $scope.requestDetailsCopy.workspaceConfiguration.technicalName.replace(/[^0-9]/g, '')) {
																$scope.saveHAProvision = false;
															}
														}
														determineSave();
													});
													$scope.request.requestDetails = angular.toJson($scope.request.requestDetails);
													function determineSave() {
														if($scope.saveHAProvision) {
															Api.RequestSteps.save($scope.request);
															var requestsArray = ModelSvc.getUserRequests();
															for(var i in requestsArray) {
																if(requestsArray[i].wsRequestGuid == $scope.request.wsRequestGuid) {
																	requestsArray.splice(i, 1);
																}
															}
															ModelSvc.setUserRequests(requestsArray);
															disableFields([ModelSvc.getUserRole() + "-wait", ModelSvc.getUserRole() + "-save", ModelSvc.getUserRole() + "-submit"]);
														} else {
															$scope.glyphiconText = "remove";
															$scope.modalMessageHeader = "Error in Submission";
															$scope.modalMessageText = "Please change the version of this sandbox, there seems to be a conflict with another workspace..";
															$("#myModal").modal();
															$scope.request.requestDetails = JSON.parse($scope.request.requestDetails);
														}
													}
													setTimeout(function(){window.location = "/#/create";}, 3000);
												}
											} else {
												$scope.glyphiconText = "remove";
												$scope.modalMessageHeader = "Error in Submission";
												$scope.modalMessageText = "Please ensure ALL fields, including 4.1, 4.2, and 4.3 are filled and/or checked.";
												$("#myModal").modal();
											}
										}
									}
								}
							}
							$scope.sourceNameOption = "";
							$scope.getSourceTables = function(sourceName) {
								$scope.sourceTablesOptions = Api.SourceTables.query({cluster:$scope.request.requestDetails.cluster.clusterCode,source:sourceName});
								$scope.sourceNameOption = sourceName;
								$scope.showSourceTables = true;
								$scope.request.requestDetails.liveSnapshotSelected = sourceName;
							}
							
							$scope.keepInputDisabled = true;
							$scope.hadoopAdminScripts = function() {
								enableDisableFields(ModelSvc.getUserRole() + "-wait", false);
								$scope.legend.formValues.workspaceConfigurationFormPermission = false;
								$("#hadoopAdminModal").modal();
							}
							
							$scope.$on('handleBroadcast', function() {
								$q.all([Api.Requests.oneRequest({rid:ModelSvc.getRequestIdentifier()}).$promise]).then(function(result) {
									$scope.request = result[0][0];
									$scope.request.requestDetails = JSON.parse(result[0][0].requestDetails);
								});
							});
							
							function capitalizeFirstLetter(string) {
							    return string.charAt(0).toUpperCase() + string.slice(1);
							}
							
							$scope.changeRDCaret = function() {
								$scope.legend.accordionViews.requestDetailsArea.downCaret = !$scope.legend.accordionViews.requestDetailsArea.downCaret;
							}
							$scope.changeCOECaret = function() {
								$scope.legend.accordionViews.coeReviewArea.downCaret = !$scope.legend.accordionViews.coeReviewArea.downCaret;
							}
							$scope.changeHACaret = function() {
								$scope.legend.accordionViews.hadoopAdminArea.downCaret = !$scope.legend.accordionViews.hadoopAdminArea.downCaret;
							}
							
							if(ModelSvc.getRequestIdentifier() == 0 && ModelSvc.getUserRole() == "WSRequestors" || ModelSvc.getUserRole() == "WSEveryone") {
								enableDisableFields(ModelSvc.getUserRole(), false);
								enableDisableFields(ModelSvc.getUserRole() + "-save", false);
								//enableDisableFields(ModelSvc.getUserRole() + "-cancel", false);
							}
							
							if(ModelSvc.getUserRole() == "WSCOES" || ModelSvc.getUserRole() == "WSHA") {
								disableFields([ModelSvc.getUserRole() + "-save"]);
							}
							if(ModelSvc.getUserRole() == "WSCOES" && ModelSvc.getRequestIdentifier() == 0 || ModelSvc.getUserRole() == "WSHA" && ModelSvc.getRequestIdentifier() == 0) {
								disableFields([ModelSvc.getUserRole() + "-save",ModelSvc.getUserRole() + "-submit"]);
							}
							if(ModelSvc.getUserRole() == "WSCOMPLIANCE") {
								disableFields([ModelSvc.getUserRole() + "-submit"]);
							}
							$scope.enableSubmit = function() {
								$("[name=" + ModelSvc.getUserRole() + "-save]").prop("disabled", false);
								$("[name=" + ModelSvc.getUserRole() + "-submit]").prop("disabled", false);
							}
							
							$(function(){
								function finish(){
									$('#neededByDate').datepicker({
										autoclose : true,
										format : "yyyy-mm-dd",
										startDate:"+0d"
									});
									$('#retireBy').datepicker({
										autoclose : true,
										format : "yyyy-mm-dd",
										startDate:"+0d"
									});
									$("[name=stageNode]").focus(function(){
										//$("#stageNodeGlyphicon").tooltip("open");
									});
									$("#stageNodeGlyphicon").tooltip();
									$("#bdCoeWorkspaceGlyphicon").tooltip();
								}
								setTimeout(finish, 2000);
							});
							if(ModelSvc.getUserRole() == "WSCOES") {
								$scope.legend.formValues.requestDetailsFormPermission = true;
							}
						} ]);