var roleNgModule = angular.module('auth.role', ['ngResource','ngCookies', 'ui.bootstrap', 'toaster','MetronicApp']);

var roleService = roleNgModule.factory('roleService',
		['$resource', function($resource){
			//指定url格式:../模块名/服务名/方法名?参数
			var path = authPath + '/rest/:moduleName/:serviceName/:methodName?rnd=:random';
			//service忠的方法
			var resource = $resource(path, {}, {
				ifenable : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'role',
						methodName : 'ifenable',
						id : '@id',
						random : Math.random()
					}
				},
				save : {
					method : 'POST',
					params : {
						moduleName : 'auth',
						serviceName : 'role',
						methodName : 'save',
						/*role : '@role',
						rp : '@rp',*/
						random : Math.random()
					}
				}
			});
			return resource;
	}]);


var roleNgCtrl = roleNgModule.controller('roleNgCtrl', function($rootScope, $scope, $http, $uibModal, $log, $cookieStore, $window, $state, roleService, httpService, toaster) {
	
	//初始化查询条件
	$scope.cookieUrl=$cookieStore.get("roleList");
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
		$cookieStore.put('roleList',$scope.Parameters);
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
			$http.get(authPath + "/rest/auth/role/delete?id=" + id,null).success(function(data){
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
		$scope.cookieUrl=$cookieStore.get("roleList");
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
                 				  { name : 'name', operator : 'Like', value : $scope.name == undefined ? "" : $scope.name },
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
		$cookieStore.put('roleList',$scope.Parameters);

		$scope.name="";

		$scope.cookieUrl=$cookieStore.get("roleList");
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
                { name : 'name', operator : 'Like', value : $scope.name },
                { name : 'applicationId', operator : 'Equal', value : applicationId }
            ])
		});
	};
	//定义一个刷新表格的方法
	$scope.reloadgrid = function () {
		$scope.instance.execute('reload');
	};
	//启用/禁用
	$scope.ifenableClick = function(id) {
		roleService.ifenable({id : id}, function(){
			$scope.reloadgrid();
		});
	};
	//编辑
	$scope.goToEdit = function(index) {
		var modalInstance = $uibModal
			.open({
				animation : true,
				backdrop : false,
				templateUrl : 'modules/auth/role/save.html',
				controller : 'saveRoleCtrl',
				size : 'lg',
				resolve : {
					roleRow : function() {
						return $scope.instance.execute('getData').rows[index];
					},
					usefulResource : function() {
						return httpService.get({
							url : authPath+'/rest/auth/resource/useful'
						});
					},
					resPermis : function() {
						return httpService.get({
							url : authPath+'/rest/auth/resource/respermis'
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
	//添加
	$scope.goToAdd = function() {
		var modalInstance = $uibModal
		.open({
			animation : true,
			backdrop : false,
			templateUrl : 'modules/auth/role/save.html',
			controller : 'saveRoleCtrl',
			size : 'lg',
			resolve : {
				roleRow : function() {
					return null;
				},
				usefulResource : function() {
					return httpService.get({
						url : authPath+'/rest/auth/resource/useful'
					});
				},
				resPermis : function() {
					return httpService.get({
						url : authPath+'/rest/auth/resource/respermis'
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
	$scope.options = {
   			url: authPath + "/rest/auth/role/list",//加载的URL
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
   			   { field: 'name', title: '角色名称', width: 90, align:'center', sortable:true, formatter: function (value, row, index) {
   				   return row.role.name;
  				}},
   			   { field: 'abbr', title: '简称', width: 90, align:'center', sortable:true, formatter: function (value, row, index) {
   				   return row.role.abbr;
 				}},
   			   { field: 'alias', title: '别名', width: 90, align:'center', sortable:true, formatter: function (value, row, index) {
   				   return row.role.alias;
 				}},
   			   { field: 'roleCode', title: '编码', width: 100, align:'center', sortable:true, formatter: function (value, row, index) {
   				   return row.role.roleCode;
 				}},
   			   {field: 'createTime', title: '创建时间', width: 150, align:'center', resizable:false, sortable:true, formatter: function (value, row, index) {
   				   return moment(row.role.createTime).format("YYYY-MM-DD HH:mm:ss");
   				}},
   			   {field: 'status', title: '是否启用', width: 150, align:'center', formatter: function (value, row, index) {
   				   var status = row.role.status
   				   return status==0?"禁用":status==1?"启用":"未知";
   			   }},
   				{field: 'operation', title: '操作', width: 150, align:'center', formatter: function (value, row, index) {
   					var str = '';
   					var status = row.role.status;
   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
						'ng-click="goToEdit(\''+index+'\')">编 辑</button>&nbsp;&nbsp;';
   					
   					if(status == '0') {
   						str = str + '<button  type="button" class="btn btn-info btn-xs"'+
   	   				    'ng-click="ifenableClick(\''+row.role.id+'\')">启 用</button>&nbsp;&nbsp;';
   					}
   					if(status == '1') {
	   					str = str + '<button  type="button" data-toggle="confirmation" data-original-title="Are you sure ?" class="btn btn-danger btn-xs"'+
	   						'ng-click="ifenableClick(\''+row.role.id+'\' )">禁 用</button>&nbsp;&nbsp';
   					}
   					
	   				str = str + '<button  type="button" class="btn btn-danger btn-xs"'+
	   					'ng-click="goDelete(\''+row.role.id+'\' )">删	除</button>';
	   				
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
   			},
   			onChangePageSize:function(pageSize){
   				$scope.rows=pageSize;
   				$scope.getPageParams();
				$scope.instance.execute('options').pageSize = pageSize;
				$scope.instance.execute('reload');
   			}
   		};
});

//添加controller
var saveRoleCtrl = roleNgModule.controller('saveRoleCtrl', function($scope, $uibModalInstance, $cookieStore, roleRow, usefulResource, resPermis, roleService){
	
	$scope.rps = resPermis;
	$scope.rrpDto = {role : null, rolePermissionDtos : []}
	
	if(roleRow == null) {
		$scope.title = '角色添加';
		$scope.role = null;
	} else {
		$scope.title = '角色编辑';
		$scope.rrpDto = {role : roleRow.role, rolePermissionDtos : roleRow.rolePermissionDtos }
		$scope.role = roleRow.role;
	}
	
	$scope.confirm = function(o) {
		if(o==false)
		   return;
		if ($scope.rrpDto.rolePermissionDtos.length != 0 ) {
			if ($scope.role != null) {
				var p = {
					id : $scope.role.id == undefined ? "" : $scope.role.id,
					name : $scope.role.name == undefined ? ""
							: $scope.role.name,
					abbr : $scope.role.abbr == undefined ? ""
							: $scope.role.abbr,
					alias : $scope.role.alias == undefined ? ""
							: $scope.role.alias,
					roleCode : $scope.role.roleCode == undefined ? ""
							: $scope.role.roleCode,
					displayNum : $scope.role.displayNum == undefined ? 1
							: $scope.role.displayNum,
					remark : $scope.role.remark == undefined ? ""
							: $scope.role.remark,
					status : $scope.role.status == undefined ? 1
							: $scope.role.status,
					deleteFlag : $scope.role.deleteFlag == undefined ? "0"
							: $scope.role.deleteFlag,
					applicationId : $scope.role.applicationId == undefined ? ""
							: $scope.role.applicationId,
					createTime : $scope.role.createTime == undefined ? null
							: $scope.role.createTime,
					createUser : $scope.role.createUser == undefined ? ""
							: $scope.role.createUser,
					updateTime : $scope.role.updateTime == undefined ? null
							: $scope.role.updateTime,
					updateUser : $scope.role.updateUser == undefined ? ""
							: $scope.role.updateUser,
				};
			}
			$scope.rrpDto.role = p;
			var r = $scope.rrpDto;
			roleService.save(r);
			//关闭模态框
			var closeModal = function() {
				$uibModalInstance.close();
			}();
		} else if(confirm("角色未分配权限，确定吗？")) {
			if ($scope.role != null) {
				var p = {
					id : $scope.role.id == undefined ? "" : $scope.role.id,
					name : $scope.role.name == undefined ? ""
							: $scope.role.name,
					abbr : $scope.role.abbr == undefined ? ""
							: $scope.role.abbr,
					alias : $scope.role.alias == undefined ? ""
							: $scope.role.alias,
					roleCode : $scope.role.roleCode == undefined ? ""
							: $scope.role.roleCode,
					displayNum : $scope.role.displayNum == undefined ? 1
							: $scope.role.displayNum,
					remark : $scope.role.remark == undefined ? ""
							: $scope.role.remark,
					status : $scope.role.status == undefined ? 1
							: $scope.role.status,
					deleteFlag : $scope.role.deleteFlag == undefined ? "0"
							: $scope.role.deleteFlag,
					applicationId : $scope.role.applicationId == undefined ? applicationId
							: $scope.role.applicationId,
					createTime : $scope.role.createTime == undefined ? null
							: $scope.role.createTime,
					createUser : $scope.role.createUser == undefined ? ""
							: $scope.role.createUser,
					updateTime : $scope.role.updateTime == undefined ? null
							: $scope.role.updateTime,
					updateUser : $scope.role.updateUser == undefined ? ""
							: $scope.role.updateUser,
				};
			}
			$scope.rrpDto.role = p;
			var r = $scope.rrpDto;
			roleService.save(r);
			//关闭模态框
			var closeModal = function() {
				$uibModalInstance.close();
			}();
		}
	}
	//全选
	$scope.selectAll = function($event,rp) {
		var checkbox = $event.target ;  
        var checked = checkbox.checked ;
        console.log(rp);
        if(checked){
        	//判断复选框是否选中
        	$scope.isChecked = function(idStr){
        		var r = rp.resource;
        		var ps = rp.children;
        		for (var i = 0; i < ps.length; i++) {
					var p = ps[i];
					var ckStr = r.id + ':' + p.id;
					if(ckStr == idStr) {
						return true;
					}
				}
        	}
        }else {
        	$scope.isChecked = function(idStr){
        		return false;
        	}
        }
	}
	//更新复选框选项
	$scope.updateSelection = function($event, rpDto){  
        var checkbox = $event.target ;  
        var checked = checkbox.checked ;  
        if(checked){ 
        	$scope.rrpDto.rolePermissionDtos.push(rpDto);
        }else{
        	//移除数组中的对象元素，因为传来的对象地址和数组中的不同，所以即使两对象值完全相同，他们也不相等，所以不能直接移除对象
        	for (var i = 0; i < $scope.rrpDto.rolePermissionDtos.length; i++) {
        		var idStr = $scope.rrpDto.rolePermissionDtos[i].resource.id + ':' + $scope.rrpDto.rolePermissionDtos[i].permission.id;
				var rmIdStr = rpDto.resource.id + ':' + rpDto.permission.id;
				//比较对象的唯一标识是否相同，如果相同，则移除该对象
				if( rmIdStr == idStr) {
					$scope.rrpDto.rolePermissionDtos.splice(i, 1);
					break;
				}
			}
        }  
    };
    //判断复选框是否选中
    $scope.isChecked = function(idStr){
    	var checkedRps = $scope.rrpDto.rolePermissionDtos;
    	//var checkedStr = [];
    	for (var i = 0; i < checkedRps.length; i++) {
			//checkedStr.push(checkedRps[i].resource.id + ':' + checkedRps[i].permission.id);
    		var checkedStr = checkedRps[i].resource.id + ':' + checkedRps[i].permission.id;
			if (idStr == checkedStr) {
				return true;
			}
		}
    	//return checkedStr.indexOf(idStr)>=0;
    }
	$scope.cancel = function(organization) {
		$uibModalInstance.dismiss('cancel');
	};
});
