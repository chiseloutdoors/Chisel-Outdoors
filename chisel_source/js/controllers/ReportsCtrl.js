mainRouter
		.controller('ReportsCtrl', ['$scope', 'Api', '$q', 'ModelSvc', '$state', 'BroadcastService', function($scope, Api, $q, ModelSvc, $state, BroadcastService) {
		  
  		  $scope.init = function(){
  		    $scope.uid = '';

          $q.all([Api.Requests.query({uid:ModelSvc.getUid(),reportId:"log"}).$promise]).then(function(result){
            $scope.requests = result[0];
            for (var i = 0; i < $scope.requests.length; i++) {
              $scope.requests[i].requestDetails = angular.fromJson($scope.requests[i].requestDetails);
            }
            calculateRequestMetrics($scope.requests);
          });
          

          $q.all([Api.Workspaces.query({}).$promise]).then(function(result){
            $scope.workspaces = result[0];
            for (var i = 0; i < $scope.workspaces.length; i++) {
              if ($scope.workspaces[i].requestDetails) {
                $scope.workspaces[i].requestDetails = angular.fromJson($scope.workspaces[i].requestDetails);
              }
            }
            
          });
          
          resizeContainer();
          
          $(window).resize(resizeContainer);
  		  };
  		  
  		  resizeContainer = function() {
  		    var body = $("tbody.resizeTbody");
  		    var offset = (body.hasClass("sla")) ? 370 : 250;
          body.height($(".col-lg-9").height() - offset);
  		  }
  		  
  		  $scope.init();

        calculateRequestMetrics = function(requests) {
          $scope.requestsLength = requests.length;
          
          var totalApprovedOver = 0;
          var totalProvisionedOver = 0;
          
          for (var i = 0; i < requests.length; i++) {
            var r = requests[i];
            var appDays = $scope.getApprovalDays(r);
            if (appDays > 3) {
              totalApprovedOver++;
            }

            var proDays = $scope.getProvisionDays(r);
            if (proDays > 5) {
              totalProvisionedOver++;
            }
          }
          
          $scope.totalApprovedOver = totalApprovedOver;
          $scope.totalProvisionedOver = totalProvisionedOver;
          
          $scope.appPercent = Math.floor((totalApprovedOver/requests.length)*100);
          $scope.appPercent = 100 - $scope.appPercent;
          
          $scope.proPercent = Math.floor((totalProvisionedOver/requests.length)*100);
          $scope.proPercent = 100 - $scope.proPercent;
        }
  		  
  		  $scope.exporttable = function(ev) {
  		    var table = $(ev.target).siblings("table.table")[0].outerHTML;
  		    var div = $("<div>" + table + "</div>");
  		    $("thead:last", div).remove();
  		    var blob = new Blob([div.html()], {
  	        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  		    });
  		    saveAs(blob, "Report.xls");
  		  };
        
        $scope.buildRequestedDate = function(request) {
          var date = "";
          var steps = request.wsRequestSteps;
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].wsSteps.stepId == 1) {
              date = steps[i].date;
            }
          }
          
          return date;
        }
        
        $scope.buildApprovedDate = function(request) {
          var date = "";
          var steps = request.wsRequestSteps;
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].wsSteps.stepId == 2) {
              date = steps[i].date;
            }
          }
          
          return date;
        }
        
        $scope.buildUpdatedDate = function(request) {
          var date = "";
          var steps = request.wsRequestSteps;
          var topDate = 0;
          var step3Found = false;
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].date > topDate) {
              topDate = steps[i].date;
              if (steps[i].wsSteps.stepId == 3) {
                step3Found = true;
              }
            }
          }
          
          if (!step3Found) {
            topDate = new Date().getTime();
          }
          
          return (topDate == null) ? "" : topDate;
        }
        
        $scope.buildHandledDays = function(request) {
          var date = "";
          var topDate = $scope.buildUpdatedDate(request);
          var steps = request.wsRequestSteps;
          var days = 0;
          //if no step 3, the handling time is today
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].wsSteps.stepId == 1) {
              days = (topDate - steps[i].date)/1000;
            }
          }
          
          return Math.floor(days / 86400);
        }
        
        $scope.buildStepName = function(request) {
          var date = "";
          var steps = request.wsRequestSteps;
          var topDate = 0;
          var stepName = "";
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].date > topDate) {
              topDate = steps[i].date;
              stepName = steps[i].wsSteps.stepName;
            }
          }
          
          return stepName;
        }
  		  
  		  $scope.buildProvisionedDate = function(request) {
  		    var date = "";
  		    var steps = request.wsRequestSteps;
  		    for (var i = 0; i < steps.length; i++) {
  		      if (steps[i].wsSteps.stepId == 3) {
  		        date = steps[i].date;
  		      }
  		    }
  		    
  		    return date;
  		  }
  		  
  		  $scope.getApprovalDays = function(request) {
          var days = 0;
          var startDate = 0;
          var endDate = $scope.buildUpdatedDate(request);
          var steps = request.wsRequestSteps;
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].wsSteps.stepId == 1) {
              startDate = steps[i].date;
            }
            if (steps[i].wsSteps.stepId == 2) {
              endDate = steps[i].date;
            }
          }
          
          days = (startDate) ? Math.floor(((endDate - startDate) / 1000) / 86400) : 0;
          
          if (days > 3) {
            request.approvedAlert = true;
          }
          
          return days;
  		  }
        
        $scope.getProvisionDays = function(request) {
          var days = 0;
          var startDate = 0;
          var endDate = $scope.buildUpdatedDate(request);
          var steps = request.wsRequestSteps;
          for (var i = 0; i < steps.length; i++) {
            if (steps[i].wsSteps.stepId == 2) {
              startDate = steps[i].date;
            }
          }
          
          days = (!startDate) ? 0 : Math.floor(((endDate - startDate) / 1000) / 86400);
          
          if (days > 5) {
            request.provisionedAlert = true;
          }
          
          return days;
        }
        
        $scope.buildResponseTime = function(request) {
          var approvalDays = $scope.getApprovalDays(request);
          var provisionDays = $scope.getProvisionDays(request);
          
          var approvalWidth = (approvalDays > 0) ? (approvalDays * 10) : 10;
          var provisionWidth = (provisionDays > 0) ? (provisionDays * 10) : 10;

          var html = "";
          
          // approval number
          html += "<div class='responseNumberContainer'>";
          if (approvalDays > 0) {
            html += "<div class='approval' style='width: " + approvalWidth + "px; max-width: 150px;'>" + approvalDays + "</div>";
          }

          // provisioned number
          if (provisionDays > 0) {
            html += "<div class='provisioning' style='width: " + provisionWidth + "px; max-width: 150px;'>" + provisionDays + "</div>";
          }
          html += "</div>";
          
          // approval html
          html += "<div class='responseTimeContainer'>";
          if (approvalDays > 0) {
            var errorClass = "";
            if (approvalDays > 3) {
              errorClass = " error";
            }
            html += "<div class='approval" + errorClass + "' style='width: " + approvalWidth + "px; max-width: 150px;'></div>";
          }
          
          // provisioned html
          if (provisionDays > 0) {
            var errorClass = "";
            if (provisionDays > 5) {
              errorClass = " error";
            }
            html += "<div class='provisioning" + errorClass + "' style='width: " + provisionWidth + "px; max-width: 150px;'></div>";
          }
          html += "</div>";
          
          return html;
        }
  		}]
		);