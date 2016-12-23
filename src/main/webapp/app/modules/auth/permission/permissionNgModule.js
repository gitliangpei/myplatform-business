var permissionNgModule = angular.module('auth.permission', ['ngResource','ngCookies', 'ui.bootstrap', 'toaster','MetronicApp']);

var permissionService = permissionNgModule.factory('permissionService',
		['$resource', function($resource){
			//指定url格式:../模块名/服务名/方法名?参数
			var path = authPath + '/rest/:moduleName/:serviceName/:methodName?rnd=:random';
			//service忠的方法
			var resource = $resource(path, {}, {
				ifenable : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'permission',
						methodName : 'ifenable',
						id : '@id',
						random : Math.random()
					}
				},
				save : {
					method : 'POST',
					params : {
						moduleName : 'auth',
						serviceName : 'permission',
						methodName : 'save',
						random : Math.random()
					}
				}
			});
			return resource;
		}]);

var permissionNgCtrl = permissionNgModule.controller('permissionNgCtrl', function($rootScope, $scope, $http, $uibModal, $log, $cookieStore, $window, $state, permissionService, toaster) {
	
	//初始化查询条件
	$scope.cookieUrl=$cookieStore.get("permissionList");
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
		$cookieStore.put('permissionList',$scope.Parameters);
	};
	
	$scope.instance = null;
	$scope.init = function () {
		return function (instance) {
			$scope.instance = instance;
		};
	};
	//删除
	$scope.goDelete = function(id) {
		if(confirm("确定删除吗？")) {
			$http.get(authPath + "/rest/auth/permission/delete?id=" + id,null).success(function(data){
				$scope.instance.execute('reload');
			}).error(function() {
				toaster.pop('error', '失败信息', '图文删除失败，请重试！');
			});
		}
	}
	//查询按钮
	$scope.query=function(){
		$scope.page = 1;
		$scope.getPageParams();
		$scope.cookieUrl=$cookieStore.get("permissionList");
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
                                  { name : 'deleteFlag', operator : 'Equal', value : 0 },
                 				  { name : 'name', operator : 'Like', value : $scope.permisName == undefined ? "" : $scope.permisName }
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
		$cookieStore.put('permissionList',$scope.Parameters);

		$scope.permisName="";

		$scope.cookieUrl=$cookieStore.get("permissionList");
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
                { name : 'deleteFlag', operator : 'Equal', value : 0 },
                { name : 'name', operator : 'Like', value : $scope.permisName },
            ])
		});
	};
	//定义一个刷新表格的方法
	$scope.reloadgrid = function () {
		$scope.instance.execute('reload');
	};
	//启用/禁用
	$scope.ifenableClick = function(id) {
		permissionService.ifenable({id : id}, function(){
			$scope.reloadgrid();
		});
	};
	//编辑
	$scope.goToEdit = function(index) {
		var modalInstance = $uibModal
			.open({
				animation : true,
				backdrop : false,
				templateUrl : 'modules/auth/permission/add.html',
				controller : 'addPermissionCtrl',
				size : 'lg',
				resolve : {
					permission : function() {
						return $scope.instance.execute('getData').rows[index];
					}
				}
			});
		modalInstance.result
		.then(
			function() {
				$scope.reloadgrid();
			},
			function() {
				$log
					.info('Modal dismissed at: '
						+ new Date());
			});
	};
	//添加
	$scope.goToAdd = function() {
		var modalInstance = $uibModal
		.open({
			animation : true,
			backdrop : false,
			templateUrl : 'modules/auth/permission/add.html',
			controller : 'addPermissionCtrl',
			size : 'lg',
			resolve : {
				permission : function() {
					return null;
				}
			}
		});
	modalInstance.result
	.then(
		function() {
			$scope.reloadgrid();
		},
		function() {
			$log
				.info('Modal dismissed at: '
					+ new Date());
		});
	}
	$scope.options = {
   			url: authPath + "/rest/auth/permission/list",//加载的URL
   			idField: "ID",
   			pagination: true,//显示分页
   			pageSize: $scope.queryDto.rows || pageSize,//分页大小
   			pageList: [5, 10, 15, 20],//每页的个数
   			pageNumber:$scope.queryDto.page || 1,                               			
   			queryParams:{
   				filter:JSON.stringify([
   				    { name : 'deleteFlag', operator : 'Equal', value : '0' }
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
   			   { field: 'name', title: '权限字', width: 90, align:'center', sortable:true },
   			   { field: 'abbr', title: '简称', width: 90, align:'center', sortable:true},
   			   { field: 'alias', title: '别名', width: 120, align:'center', sortable:true},
   			   { field: 'permissionCode', title: '编码', width: 120, align:'center', sortable:true},
   			   {field: 'createTime', title: '创建时间', width: 150, align:'center', resizable:false, sortable:true, formatter: function (value, row, index) {
   				   return moment(row.createTime).format("YYYY-MM-DD HH:mm:ss");
   				}},
   			   {field: 'status', title: '是否启用', width: 150, align:'center', formatter: function (value, row, index) {
   					return value==0?"禁用":value==1?"启用":"未知";
   			   }},
   				{field: 'operation', title: '操作', width: 150, align:'center', formatter: function (value, row, index) {
   					var str = '';
   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
						'ng-click="goToEdit(\''+index+'\')">编 辑</button>&nbsp;&nbsp;';
   					
   					if(row.status == '0') {
   						str = str + '<button  type="button" class="btn btn-info btn-xs"'+
   	   				    'ng-click="ifenableClick(\''+row.id+'\')">启 用</button>&nbsp;&nbsp;';
   					}
   					if(row.status == '1') {
	   					str = str + '<button  type="button" class="btn btn-danger btn-xs"'+
	   						'ng-click="ifenableClick(\''+row.id+'\' )">禁 用</button>&nbsp;&nbsp';
   					}
   					
	   				str = str + '<button  type="button" class="btn btn-danger btn-xs"'+
	   					'ng-click="goDelete(\''+row.id+'\' )">删	除</button>';
	   				
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

//添加controller
var addPermissionCtrl = permissionNgModule.controller('addPermissionCtrl', function($scope, $uibModalInstance, $cookieStore, permission, permissionService){
	
	$scope.title = '权限编辑';
	if(permission == null) {
		$scope.title = '权限添加';
	}
	$scope.permisData = permission;
	$scope.confirm = function(o) {
		if ($scope.permisData != null) {
			var p = {
					id : $scope.permisData.id == undefined ? "" : $scope.permisData.id,
					name : $scope.permisData.name == undefined ? "" : $scope.permisData.name,
					abbr : $scope.permisData.abbr == undefined ? "" : $scope.permisData.abbr,
					alias : $scope.permisData.alias == undefined ? "" : $scope.permisData.alias,
					permissionCode: $scope.permisData.permissionCode == undefined ? "" : $scope.permisData.permissionCode,
					displayNum: $scope.permisData.displayNum == undefined ? 1 : $scope.permisData.displayNum,
					remark : $scope.permisData.remark == undefined ? "" : $scope.permisData.remark,
					status : $scope.permisData.status == undefined ? 1 : $scope.permisData.status,
					deleteFlag : $scope.permisData.deleteFlag == undefined ? "0" : $scope.permisData.deleteFlag,
					applicationId : $scope.permisData.applicationId == undefined ? "" : $scope.permisData.applicationId,
					mngGroupId : $scope.permisData.mngGroupId == undefined ? "0" : $scope.permisData.mngGroupId,
					createTime : $scope.permisData.createTime == undefined ? null : $scope.permisData.createTime,
					createUser : $scope.permisData.createUser == undefined ? "" : $scope.permisData.createUser,
					updateTime : $scope.permisData.updateTime == undefined ? null : $scope.permisData.updateTime,
					updateUser : $scope.permisData.updateUser == undefined ? "" : $scope.permisData.updateUser,
			};
		}
		permissionService.save(p);
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