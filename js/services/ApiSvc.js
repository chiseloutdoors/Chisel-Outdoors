mainRouter.factory('Api', ['$resource', function($resource) {
	return {
		Clusters: $resource('/clusters', {}, {
			query:{method:'GET', isArray:true}
		}),
		Identity: $resource('/identity', {}, {
			query: {method:'GET', isArray:false}
		}),
		Requests: $resource('/requests', {}, {
			query: {method:'GET', params:{uid:'@uid',role:'@role'}, isArray:true},
			oneRequest: {method:'GET',params:{rid:'@rid'}, isArray:true},
			workspaceRequests:{method:'GET',params:{wsId:'@wsId'}, isArray:true},
			save: {method:'POST'}
		}),
		RequestSteps:  $resource('/requestSteps', {}, {
			query: {method:'GET', params:{}, isArray:true},
			save: {method:'POST'}
		}),
		RequestModifySteps:  $resource('/requestModifySteps', {}, {
			query: {method:'GET', params:{}, isArray:true},
			save: {method:'POST'}
		}),
		CoEThemes: $resource('/coeThemes', {}, {
			query: {method:'GET', isArray:true},
			save: {method:'POST'}
		}),
		Sources: $resource('/sources', {}, {
			query: {method:'GET', params:{cluster:'@cluster'}, isArray:true}
		}),
		SourceTables: $resource('/sourceTables', {}, {
			query: {method:'GET', params:{cluster:'@cluster', source:'@source'}, isArray:true}
		}),
		Workspaces: $resource('/workspaces', {}, {
			query:{method:'GET', params:{role:'@role',uid:'@uid'}, isArray:true}
		}),
		Workspace: $resource('/workspace', {}, {
			query:{method:'GET', params:{wsWorkspaceId:'@wsWorkspacesId'}, isArray:false},
			queryOne:{method:'GET', params:{wsId:'@wsId'}, isArray:false}
		}),
		WorkspaceNames: $resource('/workspaceNames', {}, {
			query:{method:'GET', params:{}, isArray:true}
		}),
		BusinessNames: $resource('/businessNames', {}, {
			query:{method:'GET',params:{}, isArray:true}
		}),
		WorkspaceDecomission: $resource('/decomission', {}, {
			query:{method:'GET',params:{}, isArray:true},
			save:{method:'POST'}
		}),
		LegendStepLabels: $resource('/legend', {}, {
			query:{method:'GET',params:{}, isArray:true}
		}),
		WsConfiguration: $resource('/configuration', {}, {
			query:{method:'GET', params:{}, isArray:true}
		})
	}
}]);