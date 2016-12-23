var resourceNgModule = angular.module('auth.resource', ['ngResource','ngCookies', 'ui.bootstrap', 'toaster','MetronicApp']);

var resourceService = resourceNgModule.factory('resourceService',
		['$resource', function($resource){
			//指定url格式:../模块名/服务名/方法名?参数
			var path = authPath + '/rest/:moduleName/:serviceName/:methodName?rnd=:random';
			//service忠的方法
			var resource = $resource(path, {}, {
				get : {
					method : 'GET',
					params : {
						moduleName : 'security',
						serviceName : 'proorgan',
						methodName : 'entity',
						id : '@id',
						random : Math.random()
					}
				},
				ifenable : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'resource',
						methodName : 'ifenable',
						id : '@id',
						random : Math.random()
					}
				},
				save : {
					method : 'POST',
					params : {
						moduleName : 'auth',
						serviceName : 'resource',
						methodName : 'save',
						random : Math.random()
					}
				}
			});
			return resource;
		}]);


var resourceNgCtrl = resourceNgModule.controller('resourceNgCtrl', function($rootScope, $scope, $http, $uibModal, $log, $cookieStore, $window, $state, resourceService, httpService, toaster) {
	
	//给下拉框赋值
	$scope.resTypes = [{id : null, name : '全部'}, {id : 'menu', name : '菜单资源'}, {id : 'view', name : '界面资源'}, {id : 'component', name : '组件资源'}, {id : 'dataset', name : '数据资源'}];
	$scope.resType = null;
	
	//初始化查询条件
	$scope.cookieUrl=$cookieStore.get("resourceList");
	$scope.initQueryObj = {};
	console.log($scope.cookieUrl);
	if($scope.cookieUrl) {
		var arr =$scope.cookieUrl.split('&');
		for (var i = 0; i < arr.length; i++) {
			var son_arr = arr[i].split('=');
			$scope.initQueryObj[son_arr[0]] = son_arr[1];
		}
	}
	$scope.queryDto={
				page: $scope.initQueryObj &&  $scope.initQueryObj.page && Number($scope.initQueryObj.page),
				rows: $scope.initQueryObj &&  $scope.initQueryObj.rows && Number($scope.initQueryObj.rows)
	};
	//获得翻页参数
	$scope.getPageParams=function(){
			if($scope.page)
			{
				$scope.Parameters = 'page=' + $scope.page;
			}else{
				$scope.Parameters = 'page=1';
			}
			if($scope.rows)
			{
				$scope.Parameters += '&rows=' + $scope.rows;
			}else{
				$scope.Parameters += '&rows=10';
			}
		$cookieStore.put('resourceList',$scope.Parameters);
	};
	
	$scope.instance = null;
	$scope.init = function () {
		return function (instance) {
			$scope.instance = instance;
		};
	};
	//定义一个刷新表格的方法
	$scope.reloadgrid = function () {
		$scope.instance.execute('reload');
	};
	//查询按钮
	$scope.query=function(){
		$scope.page = 1;
		$scope.getPageParams();
		$scope.cookieUrl=$cookieStore.get("resourceList");
		$scope.initQueryObj = {};
		console.log($scope.cookieUrl);
		if($scope.cookieUrl) {
			var arr =$scope.cookieUrl.split('&');
			for (var i = 0; i < arr.length; i++) {
				var son_arr = arr[i].split('=');
				$scope.initQueryObj[son_arr[0]] = son_arr[1];
			}
		}
		
		$scope.instance.execute('load', {
			filter:JSON.stringify([
                                  { name : 'deleteFlag', operator : 'Equal', value : '0' },
                 				  { name : 'name', operator : 'Like', value : $scope.resName == undefined ? "" : $scope.resName },
                 				  { name : 'resType', operator : 'Like', value : $scope.resType },
                 				  { name : 'applicationId', operator : 'Equal', value : applicationId }
                                  ]) 
		});
	};
	//清空按钮
	$scope.doClear = function () {
		$scope.Parameters = 'page=1';
		if($scope.rows){
			$scope.Parameters += '&rows=' +  $scope.rows;
		}else {
			$scope.Parameters += '&rows=10';
		}
		$cookieStore.put('resourceList',$scope.Parameters);

		$scope.resName="";
		$scope.resType = null;
		
		$scope.cookieUrl=$cookieStore.get("resourceList");
		$scope.initQueryObj = {};
		console.log($scope.cookieUrl);
		if($scope.cookieUrl) {
			var arr =$scope.cookieUrl.split('&');
			for (var i = 0; i < arr.length; i++) {
				var son_arr = arr[i].split('=');
				$scope.initQueryObj[son_arr[0]] = son_arr[1];
			}
		}
		$scope.instance.execute('options').pageNumber=$scope.initQueryObj &&  $scope.initQueryObj.page && Number($scope.initQueryObj.page);
		$scope.instance.execute('options').pageSize= $scope.initQueryObj &&  $scope.initQueryObj.rows && Number($scope.initQueryObj.rows);
		$scope.instance.execute('load', {
			filter:JSON.stringify([
                { name : 'deleteFlag', operator : 'Equal', value : '0' },
                { name : 'name', operator : 'Like', value : $scope.resName },
                { name : 'applicationId', operator : 'Equal', value : applicationId }
                /*{ name : 'name', operator : 'Like', value : $scope.resType }*/
            ])
		});
	};
	//启用/禁用
	$scope.ifenableClick = function(id) {
		resourceService.ifenable({id : id}, function(){
			$scope.reloadgrid();
		});
	};
	//删除
	$scope.goDelete = function(id) {
		if(confirm("确定删除吗？")) {
			$http.get(authPath + "/rest/auth/resource/delete?id=" + id,null).success(function(data){
				$scope.instance.execute('reload');
			}).error(function() {
				toaster.pop('error', '失败信息', '删除失败，请重试！');
			});
		}
	}
	//添加
	$scope.goToAdd = function() {
		var modalInstance = $uibModal
		.open({
			animation : true,
			backdrop : false,
			templateUrl : 'modules/auth/resource/add.html',
			controller : 'addResourceCtrl',
			size : 'lg',
			resolve : {
				rowData : function() {
					return null;
				},
				usefulPermission : function() {
					return httpService.get({
						url : authPath+'/rest/auth/permission/useful'
					});
				}
			}
		});
	modalInstance.result
	.then(
		function() {
			//location.href = '#/rolelist.html';
			//$scope.reloadgrid();
			location.reload();
		},
		function() {
			$log
				.info('Modal dismissed at: '
					+ new Date());
		});
	}
	//编辑
	$scope.goToEdit = function(index) {
		var modalInstance = $uibModal
			.open({
				animation : true,
				backdrop : false,
				templateUrl : 'modules/auth/resource/add.html',
				controller : 'addResourceCtrl',
				size : 'lg',
				resolve : {
					rowData : function() {
						return $scope.instance.execute('getData').rows[index];
					},
					usefulPermission : function() {
						return httpService.get({
							url : authPath+'/rest/auth/permission/useful'
						});
					}
				}
			});
		modalInstance.result
		.then(
			function() {
				//location.href = '#/rolelist.html';
				//$scope.reloadgrid();
				location.reload();
			},
			function() {
				$log
					.info('Modal dismissed at: '
						+ new Date());
			});
	};
	//表格数据
	$scope.options = {
   			url: authPath + "/rest/auth/resource/list",//加载的URL
   			idField: "ID",
   			pagination: true,//显示分页
   			pageSize: $scope.queryDto.rows || pageSize,//分页大小
   			pageList: [5, 10, 15, 20],//每页的个数
   			pageNumber:$scope.queryDto.page || 1,                               			
   			queryParams:{
   				filter:JSON.stringify([
   				    { name : 'deleteFlag', operator : 'Equal', value : '0' },
   				    { name : 'applicationId', operator : 'Equal', value : applicationId }
   				])
   			},
   			fit: true,//自动补全
   			fitColumns: true,
   			rownumbers:true,
   			border: true,
   			sortName: 'createTime',
   			sortOrder: 'Desc',
   			toolbar: "",
   			scrollbarSize:0,
   			singleSelect:true,
   			maxHeight:308,
   			columns: [[//每个列具体内容
   			   { field: 'name', title: '资源名称', width: 90, align:'center', sortable:true, formatter : function(value, row, index){
   	   				   var name = row.resource.name;
   	   				   return name;
   	   		   }},
   			   { field: 'resType', title: '资源类型', width: 90, align:'center', sortable:true, formatter: function (value, row, index){
   				   var type = row.resource.resType;
   				   return type=='menu'?'菜单资源':type=='view'?'界面资源':type=='component'?'组件资源':type=='dataset'?'数据资源':'无';
   			   }},
   			   { field: 'resCode', title: '资源编码', width: 120, align:'center', sortable:true, formatter : function(value, row, index){
   				   var resCode = row.resource.resCode;
   				   return resCode;
   			   }},
   			   {field: 'status', title: '是否启用', width: 90, align:'center', formatter: function (value, row, index) {
				   var 	status = row.resource.status;
   				   return status==0?"未启用":status==1?"已启用":"未知";
			   }},
			   { field: 'permissionName', title: '权限字', width: 250, align:'center', formatter: function (value, row, index) {
				   var children = row.children;
				   var permissionName = '';
				   for(var i=0; i<children.length; i++) {
					   permissionName += children[i].name + ',';
				   }
				   permissionName = permissionName.substring(0, permissionName.length-1);
				   return permissionName;
			   }},
   			   {field: 'createTime', title: '创建时间', width: 150, align:'center', resizable:false, sortable:true, formatter: function (value, row, index) {
   				   return moment(row.resource.createTime).format("YYYY-MM-DD HH:mm:ss");
   				}},
   			   {field: 'operation', title: '操作', width: 150, align:'center', formatter: function (value, row, index) {
   					var str = '';
   					var status = row.resource.status;
   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
						'ng-click="goToEdit(\''+index+'\')">编 辑</button>&nbsp;&nbsp;';
   					
   					if(status == '0') {
   						str = str + '<button  type="button" class="btn btn-info btn-xs"'+
   	   				    'ng-click="ifenableClick(\''+row.resource.id+'\')">启 用</button>&nbsp;&nbsp;';
   					}
   					if(status == '1') {
	   					str = str + '<button  type="button" class="btn btn-warning btn-xs"'+
	   						'ng-click="ifenableClick(\''+row.resource.id+'\' )">禁 用</button>&nbsp;&nbsp';
   					}
   					
	   				str = str + '<button  type="button" class="btn btn-danger btn-xs"'+
	   					'ng-click="goDelete(\''+row.resource.id+'\' )">删 除</button>';
	   				
   					return str;
   				}}
   			]],
   			onSelectPage:function(pageNumber, pageSize){
   				$scope.page=pageNumber;
   				$scope.rows=pageSize;
   				$scope.getPageParams();
				$scope.instance.execute('options').pageSize = pageSize;
				$scope.instance.execute('options').pageNumber=pageNumber;
				$scope.instance.execute('reload');
   				//$state.go('app.grapTextGroups.manageList',{Parameters:$scope.Parameters});
   			},
   			onChangePageSize:function(pageSize){
   				$scope.rows=pageSize;
   				$scope.getPageParams();
				$scope.instance.execute('options').pageSize = pageSize;
				$scope.instance.execute('reload');
   				//$state.go('app.grapTextGroups.manageList',{Parameters:$scope.Parameters});
   			}
   		};
});

//添加/编辑controller
var addResourceCtrl = resourceNgModule.controller('addResourceCtrl', function($scope, $uibModalInstance, $cookieStore, rowData, resourceService, usefulPermission){
	
	$scope.permissions = usefulPermission;
	$scope.selectPermissions = [];
	if(rowData == null) {
		$scope.title = '资源添加';
		$scope.initType = {id : 'menu'};
	} else {
		$scope.title = '资源编辑';
		$scope.resData = rowData.resource;
		//$scope.selectPermissions = rowData.children;
		for (var i = 0; i < rowData.children.length; i++) {
			for(var j=0; j<usefulPermission.length; j++) {
				if(rowData.children[i].id == usefulPermission[j].id) {
					$scope.selectPermissions.push(usefulPermission[j]);
					break;
				}
			}
		}
		$scope.initType = {id : $scope.resData.resType == undefined ? 'menu': $scope.resData.resType};
	}
	$scope.resTypes = [{id : 'menu', name : '菜单资源'}, {id : 'view', name : '界面资源'}, {id : 'component', name : '组件资源'}, {id : 'dataset', name : '数据资源'}];
	
	//选择一个权限就添加到数组
	$scope.selectFunction = function ($item, $model) {
		$scope.selectPermissions.push($item);
	};
	//移除一个权限就从数组中删除一个
	$scope.removeFunction = function ($item, $model) {
		var idx = $scope.selectPermissions.indexOf($item) ;  
        $scope.selectPermissions.splice(idx,1) ; 
	}
	$scope.confirm = function(o) {
		if(o == false) 
			return;
		if ($scope.resData != null) {
			var p = {
					id : $scope.resData.id == undefined ? "" : $scope.resData.id,
					name : $scope.resData.name == undefined ? "" : $scope.resData.name,
					resCode: $scope.resData.resCode == undefined ? "" : $scope.resData.resCode,
					resType: $scope.initType.id,
					displayNum: $scope.resData.displayNum == undefined ? 1 : $scope.resData.displayNum,
					remark : $scope.resData.remark == undefined ? "" : $scope.resData.remark,
					status : $scope.resData.status == undefined ? 1 : $scope.resData.status,
					deleteFlag : $scope.resData.deleteFlag == undefined ? "0" : $scope.resData.deleteFlag,
					createTime : $scope.resData.createTime == undefined ? null : $scope.resData.createTime,
					createUser : $scope.resData.createUser == undefined ? "" : $scope.resData.createUser,
					updateTime : $scope.resData.updateTime == undefined ? null : $scope.resData.updateTime,
					updateUser : $scope.resData.updateUser == undefined ? "" : $scope.resData.updateUser,
					applicationId : $scope.resData.applicationId == undefined ? applicationId : $scope.resData.applicationId
			};
			
			var dto = {
				resource : p,
				children : $scope.selectPermissions
			}
		}
		resourceService.save(dto);
		//关闭模态框
		var closeModal = function () {
			$uibModalInstance.close();
		}();
		//保存后刷新列表
	}
	$scope.cancel = function(organization) {
		$uibModalInstance.dismiss('cancel');
	};
});