var menuNgModule = angular.module('auth.menu', ['ngResource','ngCookies', 'ui.bootstrap', 'toaster','MetronicApp']);

var menuService = menuNgModule.factory('menuService',
		['$resource', function($resource){
			//指定url格式:../模块名/服务名/方法名?参数
			var path = authPath + '/rest/:moduleName/:serviceName/:methodName?rnd=:random';
			//service忠的方法
			var resource = $resource(path, {}, {
				ifenable : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'menu',
						methodName : 'ifenable',
						id : '@id',
						random : Math.random()
					}
				},
				save : {
					method : 'POST',
					params : {
						moduleName : 'auth',
						serviceName : 'menu',
						methodName : 'save',
						random : Math.random()
					}
				}
			});
			return resource;
		}]);



var menuNgCtrl = menuNgModule.controller('menuNgCtrl', function($rootScope, $scope, $http, $uibModal, $log, $cookieStore, $window, $state, $stateParams, menuService, httpService, toaster) {
	
	$scope.tempStr=0;
	if($stateParams.currentPage){
		$scope.tempStr=Number($stateParams.currentPage);
	}
	//解析url中的查询条件
	(function(){
		$scope.cookieUrl=$cookieStore.get("menuList");
		$scope.initQueryObj = {};
		console.log($scope.cookieUrl);
		if($scope.cookieUrl) {
			var arr =$scope.cookieUrl.split('&');
			for (var i = 0; i < arr.length; i++) {
				var son_arr = arr[i].split('=');
				$scope.initQueryObj[son_arr[0]] = son_arr[1];
			}
		}
	})();
	//初始化查询条件
	(function () {
		$scope.queryDto = {
			name:$scope.initQueryObj && $scope.initQueryObj.name
		};
	})();
	//绑定页面查询信息
	$scope.bindPageQueryParams = function () {
		if ($scope.initQueryObj.hasOwnProperty('name')) {
			$scope.name = $scope.initQueryObj.name;
		}
	}();
	//查询按钮
	$scope.query = function () {
		$scope.getPageParams();
		//$state.go('app.system.organizatonList', {currentPage: $scope.tempStr});
		//location.href = '#/menulist.html?currentPage=' + $scope.tempStr;
		$scope.instance.execute('load', {
			filter:JSON.stringify([
                 { name : 'deleteFlag', operator : 'Equal', value : '0' },
                 { name : 'name', operator : 'Like', value : $scope.name == undefined ? "" : $scope.name },
                 ]) 
		});
	};
	//清空按钮
	$scope.doClear = function () {
		$cookieStore.put('menuList',$scope.str);
		$scope.tempStr=$scope.tempStr+1;
		//$state.go('app.system.organizatonList', {currentPage: $scope.tempStr});
		//location.href = '#/menulist.html?currentPage=' + $scope.tempStr;
		$scope.name="";
		$scope.instance.execute('load', {
			filter:JSON.stringify([
                { name : 'deleteFlag', operator : 'Equal', value : '0' },
                { name : 'name', operator : 'Like', value : $scope.name },
            ])
		});
	};
	$scope.instance = null;
	$scope.init = function () {
		return function (instance) {
			$scope.instance = instance;
		};
	};
	//刷新数据的方法
	$scope.reloadgrid = function () {
		$scope.instance.execute('reload');
	};
	//获取参数
	$scope.getPageParams = function () {
		if ($scope.name) {
			$scope.str += '&name=' + $scope.name;
		}
		$cookieStore.put('menuList',$scope.str);
		$scope.tempStr=$scope.tempStr+1;
	};
	//启用/禁用
	$scope.ifenableClick = function(id) {
		menuService.ifenable({id : id}, function(){
			$scope.reloadgrid();
		});
	};
	//删除
	$scope.goDelete = function(id) {
		if(confirm("确定删除吗？")) {
			$http.get(authPath + "/rest/auth/menu/delete?id=" + id,null).success(function(data){
				$scope.instance.execute('reload');
			}).error(function() {
				toaster.pop('error', '失败信息', '删除失败，请重试！');
			});
		}
	}
	//添加
	$scope.goToAdd = function() {
		var selectData = $scope.instance.execute('getSelected');
		var modalInstance = $uibModal
		.open({
			animation : true,
			backdrop : false,
			templateUrl : 'modules/auth/menu/add.html',
			controller : 'addMenuCtrl',
			size : 'lg',
			resolve : {
				rowData : function() {
					return selectData;
				},
				usefulResource : function() {
					return httpService.get({
						url : authPath+'/rest/auth/resource/useful'
					});
				},
				editFlag : function() {
					return false;
				},
				parentRow : function() {
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
	//编辑
	$scope.goToEdit = function(id) {
		var selectData = $scope.instance.execute('find', id);
		var parentData = $scope.instance.execute('getParent', id);
		var modalInstance = $uibModal
			.open({
				animation : true,
				backdrop : false,
				templateUrl : 'modules/auth/menu/add.html',
				controller : 'addMenuCtrl',
				size : 'lg',
				resolve : {
					rowData : function() {
						return selectData;
					},
					usefulResource : function() {
						return httpService.get({
							url : authPath+'/rest/auth/resource/useful'
						});
					},
					editFlag : function() {
						return true;
					},
					parentRow : function() {
						return parentData;
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
	//表格树数据
	$scope.options = {
			url: authPath + "/rest/auth/menu/list",
			border: false,
			toolbar: "#menuListTb",
			rownumbers: true,
			queryParams: {
				filter: JSON.stringify([{name: 'deleteFlag', operator: 'Equal', value: '0'}])
			},
			rownumbers: true,
			fit: true,//自动补全
			fitColumns: true,
			idField: 'id',
			animate: true,
			treeField: 'name',
			sortName: 'displayNum',
   			sortOrder: 'Asc',
			parentField:'parentId',
			maxHeight:350,
			frozenColumns:[[
			    {field: 'name', title: '菜单名称', width: 200}
			]],
			columns: [[
			    {field: 'url', title: '地址', width: 150},
			    {field: 'resource', title: '所属资源', width: 90, formatter:function(value, row, index){
			    	return value.name;
			    }},
			    {field: 'icon', title: '图标', width: 90},
			    {field: 'displayNum', title: '顺序', width: 90},
			    {field: 'status', title: '状态', width: 90, formatter:function(value, row, index){
			    	return value==0?"禁用":value==1?"启用":"未知";
			    }},
				{field: 'operation', title: '操作', width: 180,formatter: function (value, row, index) {
					var str = '';
   					var status = row.status;
   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
						'ng-click="goToEdit(\''+row.id+'\')">编 辑</button>&nbsp;&nbsp;';
   					
   					if(status == '0') {
   						str = str + '<button  type="button" class="btn btn-info btn-xs"'+
   	   				    'ng-click="ifenableClick(\''+row.id+'\')">启 用</button>&nbsp;&nbsp;';
   					}
   					if(status == '1') {
	   					str = str + '<button  type="button" class="btn btn-warning btn-xs"'+
	   						'ng-click="ifenableClick(\''+row.id+'\' )">禁 用</button>&nbsp;&nbsp';
   					}
   					
	   				str = str + '<button  type="button" class="btn btn-danger btn-xs"'+
	   					'ng-click="goDelete(\''+row.id+'\' )">删 除</button>';
	   				
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
var addMenuCtrl = menuNgModule.controller('addMenuCtrl', function($scope, $uibModalInstance, $cookieStore, rowData, menuService, editFlag, parentRow, usefulResource){
	
	$scope.resources = usefulResource;
	
	if(rowData != null) {
		if(editFlag) {
			$scope.title = '菜单编辑';
			$scope.menu = rowData;
			$scope.parentData = {
				id : parentRow == null ? "" : parentRow.id, 
				name : parentRow == null ? "最上级" : parentRow.name
		    };
			$scope.resId = rowData.resource.id;
		} else {
			$scope.title = '菜单添加';
			$scope.parentData = {id : rowData.id, name : rowData.name};
			$scope.resId = usefulResource[0].id;
		} 
	} else {
		$scope.parentData = {id : '', name : '无'};
	}
	
	$scope.confirm = function(o) {
		if(o == false) 
			return;
		if ($scope.menu != null) {
			var p = {
					id : $scope.menu.id == undefined ? "" : $scope.menu.id,
					name : $scope.menu.name == undefined ? "" : $scope.menu.name,
					url: $scope.menu.url == undefined ? "" : $scope.menu.url,
				    href: $scope.menu.href == undefined ? "" : $scope.menu.href,
					displayNum: $scope.menu.displayNum == undefined ? 1 : $scope.menu.displayNum,
					remark : $scope.menu.remark == undefined ? "" : $scope.menu.remark,
					status : $scope.menu.status == undefined ? 1 : $scope.menu.status,
					deleteFlag : $scope.menu.deleteFlag == undefined ? "0" : $scope.menu.deleteFlag,
					createTime : $scope.menu.createTime == undefined ? null : $scope.menu.createTime,
					createUser : $scope.menu.createUser == undefined ? "" : $scope.menu.createUser,
					updateTime : $scope.menu.updateTime == undefined ? null : $scope.menu.updateTime,
					updateUser : $scope.menu.updateUser == undefined ? "" : $scope.menu.updateUser,
					resourceId : $scope.resId == undefined ? "" : $scope.resId,
					icon : $scope.menu.icon == undefined ? "" : $scope.menu.icon,
					parentId : $scope.parentData.id == undefined ? "" : $scope.parentData.id
			};
		}
		menuService.save(p);
		//关闭模态框
		var closeModal = function () {
			$uibModalInstance.close();
		}();
	}
	$scope.cancel = function(organization) {
		$uibModalInstance.dismiss('cancel');
	};
});
