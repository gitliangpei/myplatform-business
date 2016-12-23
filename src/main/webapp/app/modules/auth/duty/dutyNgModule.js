var dutyNgModule = angular.module('auth.duty', ['ngResource','ngCookies', 'ui.bootstrap', 'toaster','MetronicApp']);

var dutyService = dutyNgModule.factory('dutyService',
		['$resource', function($resource){
			//指定url格式:../模块名/服务名/方法名?参数
			var path =  authPath + '/rest/:moduleName/:serviceName/:methodName?rnd=:random';
			//service忠的方法
			var resource = $resource(path, {}, {
				ifenable : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'duty',
						methodName : 'ifenable',
						id : '@id',
						random : Math.random()
					}
				},
				save : {
					method : 'POST',
					params : {
						moduleName : 'auth',
						serviceName : 'duty',
						methodName : 'save',
						/*role : '@role',
						rp : '@rp',*/
						random : Math.random()
					}
				},
				saveEmpDuty : {
					method : 'POST',
					params : {
						moduleName : 'auth',
						serviceName : 'employeeDuty',
						methodName : 'save',
						/*role : '@role',
						rp : '@rp',*/
						random : Math.random()
					}
				},
				saveEmpDutyProo : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'duty',
						methodName : 'saveEmpDutyProo',
						dpeIdDto : '@dpeIdDto',
						random : Math.random()
					}
				},
				getStdDescendant : {
					method : 'GET',
					params : {
						moduleName : 'business',
						serviceName : 'proorgan',
						methodName : 'getStdDescendants',
						proorganId : '@proorganId',
						random : Math.random()
					},
					isArray : true
				},
				getExistEmps : {
					method : 'GET',
					params : {
						moduleName : 'auth',
						serviceName : 'employeeDuty',
						methodName : 'findEmps',
						dutyId : '@dutyId',
						proorganId : '@proorganId',
						random : Math.random()
					},
					isArray : true
				}
			});
			return resource;
	}]);


var dutyNgCtrl = dutyNgModule.controller('dutyNgCtrl', function($rootScope, $scope, $http, $uibModal, $log, $cookieStore, $window, $state, dutyService, httpService, toaster) {
	
	//初始化查询条件
	$scope.cookieUrl=$cookieStore.get("dutyList");
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
		$cookieStore.put('dutyList',$scope.Parameters);
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
			$http.get( authPath + "/rest/auth/duty/delete?id=" + id,null).success(function(data){
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
		$scope.cookieUrl=$cookieStore.get("dutyList");
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
                 				  { name : 'name', operator : 'Like', value : $scope.name == undefined ? "" : $scope.name }
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

		$scope.cookieUrl=$cookieStore.get("dutyList");
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
            ])
		});
	};
	//定义一个刷新表格的方法
	$scope.reloadgrid = function () {
		$scope.instance.execute('reload');
	};
	//启用/禁用
	$scope.ifenableClick = function(id) {
		dutyService.ifenable({id : id}, function(){
			$scope.reloadgrid();
		});
	};
	//编辑
	$scope.goToEdit = function(index) {
		var modalInstance = $uibModal
			.open({
				animation : true,
				backdrop : false,
				templateUrl : 'modules/auth/duty/save.html',
				controller : 'saveDutyCtrl',
				size : 'lg',
				resolve : {
					rowData : function() {
						return $scope.instance.execute('getData').rows[index];
					},
					usefulRoles : function() {
						return httpService.get({
							url : authPath+'/rest/auth/role/useful'
						});
					},
					usefulDomains : function() {
						return httpService.get({
							url : authPath+'/rest/business/domain/useful'
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
			templateUrl : 'modules/auth/duty/save.html',
			controller : 'saveDutyCtrl',
			size : 'lg',
			resolve : {
				rowData : function() {
					return null;
				},
				usefulRoles : function() {
					return httpService.get({
						url : authPath+'/rest/auth/role/useful'
					});
				},
				usefulDomains : function() {
					return httpService.get({
						url : authPath+'/rest/business/domain/useful'
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
	//添加人员
	$scope.addEmployee = function(index) {
		var modalInstance = $uibModal
		.open({
			animation : true,
			backdrop : false,
			templateUrl : 'modules/auth/duty/addEmployee.html',
			controller : 'addEmployeeCtrl',
			size : 'lg',
			resolve : {
				rowData : function() {
					return $scope.instance.execute('getData').rows[index];
				},
			}
		});
	modalInstance.result
	.then(
		function() {
			//location.href = '#/rolelist.html';
			$scope.reloadgrid();
			//location.reload(); 
		},
		function() {
			$log
				.info('Modal dismissed at: '
					+ new Date());
		});
	}
	$scope.options = {
   			url: authPath + "/rest/auth/duty/list",//加载的URL
   			idField: "ID",
   			pagination: true,//显示分页
   			pageSize: $scope.queryDto.rows || 10,//分页大小
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
   			   { field: 'name', title: '职责名称', width: 80, sortable:true, formatter: function (value, row, index) {
   				   return row.duty.name;
  				}},
  			   { field: 'domain', title: '业务域', width: 90, formatter: function (value, row, index) {
  					return row.domain.name;
  			   }},
   			   { field: 'abbr', title: '简称', width: 60, sortable:true, formatter: function (value, row, index) {
   				   return row.duty.abbr;
 				}},
   			   { field: 'alias', title: '别名', width: 60, sortable:true, formatter: function (value, row, index) {
   				   return row.duty.alias;
 				}},
   			   { field: 'dutyCode', title: '编码', width: 90, sortable:true, formatter: function (value, row, index) {
   				   return row.duty.dutyCode;
 				}},
   			   {field: 'createTime', title: '创建时间', width: 120, resizable:false, sortable:true, formatter: function (value, row, index) {
   				   return moment(row.duty.createTime).format("YYYY-MM-DD HH:mm:ss");
   				}},
   			   {field: 'status', title: '是否启用', width: 70, formatter: function (value, row, index) {
   				   var status = row.duty.status
   				   return status==0?"禁用":status==1?"启用":"未知";
   			   }},
   				{field: 'operation', title: '操作', width: 150, formatter: function (value, row, index) {
   					var str = '';
   					var status = row.duty.status;
   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
						'ng-click="goToEdit(\''+index+'\')">编 辑</button>&nbsp;&nbsp;';
   					
   					if(status == '0') {
   						str = str + '<button  type="button" class="btn btn-info btn-xs"'+
   	   				    'ng-click="ifenableClick(\''+row.duty.id+'\')">启 用</button>&nbsp;&nbsp;';
   					}
   					if(status == '1') {
	   					str = str + '<button  type="button" data-toggle="confirmation" data-original-title="Are you sure ?" class="btn btn-danger btn-xs"'+
	   						'ng-click="ifenableClick(\''+row.duty.id+'\' )">禁 用</button>&nbsp;&nbsp';
   					}
   					
   					str = str + '<button  type="button" class="btn btn-info btn-xs"'+
   				    'ng-click="addEmployee(\''+index+'\')">查看人员</button>&nbsp;&nbsp;';
   					
	   				str = str + '<button  type="button" class="btn btn-danger btn-xs"'+
	   					'ng-click="goDelete(\''+row.duty.id+'\' )">删	除</button>';
	   				
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
var saveDutyCtrl = dutyNgModule.controller('saveDutyCtrl', function($scope, $uibModalInstance, $cookieStore, rowData, usefulRoles,usefulDomains, dutyService){
	
	$scope.roles = usefulRoles;
	$scope.domains = usefulDomains;
	$scope.domainId = usefulDomains[0].domainId;
	
	$scope.selectRoles = [];
	$scope.proorganId = '';
	
	if(rowData == null) {
		$scope.title = '职责添加';
	} else {
		$scope.title = '职责编辑';
		$scope.duty = rowData.duty;
		$scope.domainId = rowData.domain.domainId;
		//给角色赋值
		for (var i = 0; i < rowData.roles.length; i++) {
			for(var j=0; j<usefulRoles.length; j++) {
				if(rowData.roles[i].id == usefulRoles[j].id) {
					$scope.selectRoles.push(usefulRoles[j]);
					break;
				}
			}
		}
	}
	//选择一个就添加到数组
	$scope.selectRole = function ($item, $model) {
		$scope.selectRoles.push($item);
	};
	//移除一个就从数组中删除一个
	$scope.removeRole = function ($item, $model) {
		var idx = $scope.selectRoles.indexOf($item) ;  
        $scope.selectRoles.splice(idx,1) ; 
	}
	$scope.confirm = function(o) {
		if(o == false) 
			return;
		if ($scope.duty != null) {
			var p = {
					id : $scope.duty.id == undefined ? "" : $scope.duty.id,
					domainId : $scope.domainId == undefined ? "" : $scope.domainId,
					name : $scope.duty.name == undefined ? "" : $scope.duty.name,
					abbr : $scope.duty.abbr == undefined ? "" : $scope.duty.abbr,
					alias : $scope.duty.alias == undefined ? "" : $scope.duty.alias,
					dutyCode: $scope.duty.dutyCode == undefined ? "" : $scope.duty.dutyCode,
					displayNum: $scope.duty.displayNum == undefined ? 1 : $scope.duty.displayNum,
					remark : $scope.duty.remark == undefined ? "" : $scope.duty.remark,
					status : $scope.duty.status == undefined ? 1 : $scope.duty.status,
					deleteFlag : $scope.duty.deleteFlag == undefined ? "0" : $scope.duty.deleteFlag,
					createTime : $scope.duty.createTime == undefined ? null : $scope.duty.createTime,
					createUser : $scope.duty.createUser == undefined ? "" : $scope.duty.createUser,
					updateTime : $scope.duty.updateTime == undefined ? null : $scope.duty.updateTime,
					updateUser : $scope.duty.updateUser == undefined ? "" : $scope.duty.updateUser,
			};
			
			var dto = {
				duty : p,
				roles : $scope.selectRoles,
			}
		}
		dutyService.save(dto);
		//关闭模态框
		var closeModal = function () {
			$uibModalInstance.close();
		}();
	}
	$scope.cancel = function(organization) {
		$uibModalInstance.dismiss('cancel');
	};
});

//添加人员controller
var addEmployeeCtrl = dutyNgModule.controller('addEmployeeCtrl', function($scope, $stateParams, $http, $uibModal,$state, $rootScope, $window, $cookieStore, $log, $document, $uibModalInstance,dutyService, rowData,httpService){
	
	$scope.domainName = rowData.domain.name;
	$scope.dutyId = rowData.duty.id;
	
	$scope.$watch('$viewContentLoaded',function () {// 监听
		//jstree机构树
		$scope.initTree = function (domainid) {
	        $('#treeview').jstree({
	            //'plugins': [ 'changed', 'wholerow', 'types', 'contextmenu' ],
	        	'plugins' : [ /*'checkbox',*/
								'contextmenu', 'dnd',
								'massload', 'search',
								'sort', 'state', 'types',
								'unique', 'wholerow',
								'changed',
								'conditionalselect' ],
	            'core': {
	                'themes': {
	                    'responsive': false
	                }, 
	                'data': {
	                    'url': function (p_node) {
	                        // return '../rest/standard/architecture/children';
	                        return authPath + '/rest/business/proorgan/getProorgan';
	                    },
	                    'data': function (p_node) {
	                        var param = { 'domainId':domainid,
	                        			  'parentProorganId': p_node.id};
	                        if (p_node.id === '#') {
	                            param.parent = null; 
	                        }
	                        return param;
	                    }, 
	                    'dataFilter': function(p_response) {
	                         p_response = JSON.parse(p_response);
	                    	
	                        var children = [];
	                        
	                            if (p_response !== null) {
	                                // 记录原始数据
	                                $scope.updateStdOrganData(p_response);
	                                // 构建树节点数据
	                                $.each(p_response, function(p_index, p_item) {
	                                    children.push({
	                                        'id': p_item['id'],
	                                        'text': p_item['name'],
	                                        'type': p_item['type'],
	                                        // 'icon': 
	                                        // 'state': 
	                                        'children': true
	                                        // 'li_attr': {}, 
	                                        // 'a_attr': {}
	                                    });
	                                }); 
	                            }
	                        
	                        return JSON.stringify(children);
	                    }
	                }, 
	                'strings': {  
	                    'Loading ...': '正在加载...'  
	                }, 
	            },
	            'contextmenu': {
	                'items': {  
	                    'create': null,  
	                    'rename': null,  
	                    'remove': null,  
	                    'ccp': null,  
	                    '新建': {  
	                        'label':'新建菜单',  
	                        'action':function(data){  
	                             var inst = jQuery.jstree.reference(data.reference),  
	                             obj = inst.get_node(data.reference);  
	                            // dialog.show({'title':'新建“'+obj.text+'”的子菜单',url:'/accountmanage/createMenu?id='+obj.id,height:280,width:400});  
	                        }  
	                    }, 
	                    '编辑': {  
	                        'label': '编辑菜单',  
	                        'action': function(data) {  
	                            // var inst = jQuery.jstree.reference(data.reference),  
	                            // obj = inst.get_node(data.reference);  
	                            // dialog.show({'title':'编辑“'+obj.text+'”菜单',url:'/accountmanage/editMenu?id='+obj.id,height:280,width:400});  
	                        }  
	                    },  
	                    '删除': {  
	                        'label':'删除菜单',  
	                        'action':function(data){  
	                            // var inst = jQuery.jstree.reference(data.reference),  
	                            // obj = inst.get_node(data.reference);  
	                            // if(confirm('确定要删除此菜单？删除后不可恢复。')){  
	                            //     jQuery.get('/accountmanage/deleteMenu?id='+obj.id,function(dat){  
	                            //         if (dat == 1) { 
	                            //             alert('删除菜单成功！');  
	                            //             jQuery('#'+treeid).jstree('refresh');  
	                            //         } else { 
	                            //             alert('删除菜单失败！'); 
	                            //         } 
	                            //     }); 
	                            // } 
	                        } 
	                    } 
	                } 
	            }, 
	            'types': {//改变图标
	                'default': {
	                    'icon': 'fa fa-folder icon-state-warning icon-lg'
	                },
	                'com': {
	                    'icon': 'fa fa-institution icon-state-info icon-lg'
	                },
	                'org': {
	                    'icon': 'fa fa-info-circle icon-state-info icon-lg'
	                }
	            } 
	            // 'state': { 'key': 'demo2' }
	        }).on('loaded.jstree', function(e, data){  
			    var inst = data.instance;  
			    var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);//默认选中第一项
			      
			    inst.select_node(obj);  
			});

	        //选中得节点
	        $('#treeview').on('select_node.jstree', function(p_event, p_selected) { 
	            var nodePath = $('#treeview').jstree('get_path', p_selected.node, ' | ', true);
	            //传递节点id
	            $scope.proorganId = p_selected.node.id;
	            //获取存在的人员
        		dutyService.getExistEmps({dutyId : $scope.dutyId, proorganId : $scope.proorganId}, function(emp){
        			$scope.existEmps = emp;
        		})
	            //通过节点id获取后代子机构		            
	            dutyService.getStdDescendant({proorganId : $scope.proorganId},function(data){   		
	            	$scope.dtos = data;//所有的人员
	            	console.log($scope.dtos);
	            	$scope.selectedEmpIds = '';
	            	if($scope.dtos.length > 0) {
	            		for (var i = 0; i < $scope.dtos.length; i++) {
	            			$scope.selectedEmpIds += $scope.dtos[i].tEmployee.id + ',';
	            		}
	            		$scope.selectedEmpIds = $scope.selectedEmpIds.substring(0, $scope.selectedEmpIds.length-1);
	            	}
	            	console.log($scope.selectedEmpIds);
	            	//重新载入查询条件
	            	$scope.instance.execute('load', {
	            		filter:JSON.stringify([
	            		                       { name : 'deleteFlag', operator : 'Equal', value : 0},
	            		                       { name : 'status', operator : 'Equal', value : 1 },
	            		                       { name : 'id', operator : 'In', value : $scope.selectedEmpIds }
	            		                       ])
	            	});
	            },function(msg){
	            	// alert(msg);
	            });
	        });
	    };
	    
	    $scope.updateStdOrganData = function (p_data) {
	    	
	    };
	    $scope.init = function () {
	    	var domainId = rowData.duty.domainId;
	        $scope.initTree(domainId);
	    };
	    $scope.init();
	    $rootScope.settings.layout.pageContentWhite = true;
	    $rootScope.settings.layout.pageBodySolid = false;
	    $rootScope.settings.layout.pageSidebarClosed = false;
	    
	});
	
	/*-------------------------员工datagrid开始	-----------------------*/    
	//初始化查询条件
	$scope.cookieUrl=$cookieStore.get("employeeList");
	$scope.initQueryObj = {};
	console.log($scope.cookieUrl);
	if($scope.cookieUrl) {
		var arr =$scope.cookieUrl.split('&');
		for (var i = 0; i < arr.length; i++) {
			var son_arr = arr[i].split('=');
			$scope.initQueryObj[son_arr[0]] = son_arr[1];
		}
	}
	console.log($scope.initQueryObj);
	$scope.queryDto={	
				realName: $scope.initQueryObj && $scope.initQueryObj.realName ,
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
			if($scope.realName )
			{
				$scope.Parameters+='&realName='+$scope.realName;
			}
			
		$cookieStore.put('employeeList',$scope.Parameters);
		};
		
		//员工表格options
		$scope.options = {
	   			url:   authPath+'/rest/security/employee/getAll',//加载的URL
	   			idField: "ID",
	   			pagination: true,//显示分页
	   			pageSize: $scope.queryDto.rows || pageSize,//分页大小
	   			pageList: [5, 10, 15, 20],//每页的个数
	   			pageNumber:$scope.queryDto.page || 1,
	   			queryParams:{
	   				filter:JSON.stringify([
	   				    { name : 'deleteFlag', operator : 'Equal', value :'0'},
	   					{ name : 'status', operator : 'Equal', value : 1}				
	   					])
	   			},
	   			fit: true,//自动补全
	   			fitColumns: true,
	   			rownumbers:true,
	   			border: true,
	   			sortName: 'createTime',
	   			sortOrder: 'Desc',
	   			scrollbarSize:0,
	   			singleSelect:true,
	   			maxHeight:308,
	   			columns: [[//每个列具体内容
	   			    { field: 'guId', title: '员工编码', width: 60 },
	   				{ field: 'realName', title: '真实姓名',  width: 60 },
	   				{ field: 'identification', title: '身份证号',  width: 100 },
	   				{
						field : 'operation',
						title : '操作',
						width : 40,
						align : 'center',
						formatter : function(value, row, index) {
							var str = '';
							str = str + '<input  type="checkbox"' 
							          + 'ng-click="updateSelection($event,\''+ $scope.proorganId + '\',\''+ index + '\')"'
									  + 'ng-checked="isChecked(\''+ $scope.proorganId + '\',\''+ index + '\')">'
							return str;
						}
					}
	   			  				
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
	   			
	   		};//options结束
		//$scope.instance初始化	
   		$scope.instance = null;
		$scope.init = function() {
			return function(instance) {
				$scope.instance = instance;
			};
		};
		//定义一个刷新表格的方法
		$scope.reloadgrid = function () {
			$scope.instance.execute('reload');
		};
    //员工datagrid结束	
	$(window).resize();// 改变窗口大小重新 加载页面
		
		
	//监听ng-repeat是否完成
//	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
//		$("#my_multi_select1").multiSelect();//如果完成调用此方法，用来渲染出多选框
//	});
	
    $scope.cancel = function(organization) {
		$uibModalInstance.dismiss('cancel');
	};
	// 更新复选框选项
	$scope.dpeIdDto = []
	$scope.updateSelection = function($event,proorganId,index) {
		var employee = $scope.instance.execute('getData').rows[index];// 用index得到这一行的数据
		var checkbox = $event.target;
		var checked = checkbox.checked;
		var checkedStr = rowData.duty.id + ':' + proorganId +':'+ employee.id;
		if (checked) {
			if(jQuery.inArray(checkedStr, $scope.dpeIdDto)==-1){
				$scope.dpeIdDto.push(checkedStr);//把选中的人员放到数组中
			}
			console.log($scope.dpeIdDto);// 打印到前台测试
		} else {
			// 移除数组中的对象元素，因为传来的对象地址和数组中的不同，所以即使两对象值完全相同，他们也不相等，所以不能直接移除对象
			var employee = $scope.instance.execute('getData').rows[index];
			var checkedStr = rowData.duty.id + ':' + proorganId +':'+ employee.id;
			var i = $scope.dpeIdDto.indexOf(checkedStr);//
			$scope.dpeIdDto.splice(i, 1);// 复选框移除选中
			console.log($scope.dpeIdDto);// 打印到前台测试
		}
	};
	//判断复选框是否选中
    $scope.isChecked = function(proorganId,index){
    	if(proorganId == "undefined" || $scope.dtos == undefined || $scope.existEmps == undefined)
    		return false;
    	
    	//var checkedDtos = $scope.dtos;
    	var employee = $scope.instance.execute('getData').rows[index];// 用index得到这一行的数据
    	var rowIdStr = '';
    	if(employee != undefined){
    		rowIdStr = rowData.duty.id + ':' + proorganId +':'+ employee.id;
    	}
    	//var checkedStr = [];
    	for (var j = 0; j < $scope.existEmps.length; j++) {
    		var checkedStr = rowData.duty.id +':'+ proorganId +':'+ $scope.existEmps[j].id;
    		if (rowIdStr == checkedStr) {
    			return true;
    		}
    	}
    	//return checkedStr.indexOf(idStr)>=0;
    }
	$scope.confirm = function() {
		var dpeIdDto = JSON.stringify($scope.dpeIdDto);
		
		httpService.get({
			url : authPath + "/rest/auth/duty/saveEmpDutyProo?dpeIdDto=" + dpeIdDto
		});
		var closeModal = function () {
			$uibModalInstance.close();
		}();
	}
//	 function clearPhase() { angular.js 16352 会将checkbox选中清除
//	      $rootScope.$$phase = null;
//	    }
	
	//查询按钮
	$scope.query=function(){
		$scope.page = 1;
		$scope.getPageParams();
		$scope.cookieUrl=$cookieStore.get("employeeList");
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
                 				  { name : 'realName', operator : 'Like', value : $scope.name == undefined ? "" : $scope.name }
                                  ]) 
		});
	};
});
