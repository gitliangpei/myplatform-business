var stdorganEmployeeNgModule = angular.module('example.stdwj', [
		'ngResource', 'ngCookies', 'toaster','angularFileUpload','MetronicApp' ]);
var employeeService = stdorganEmployeeNgModule
.factory(
		'employeeService',
		[
				'$resource',
				function($resource) {
					var path = authPath+'/rest/:moduleName/:serviceName/:methodName?rnd=:random';
					var resource = $resource(path, {}, {
						getEmployeeById : {
							method : 'GET',
							params : {
								moduleName : 'security',
								serviceName : 'employee',
								methodName : 'findOneById',
								        id : '@id',
								random : Math.random()
							},
							
						},						
						del : {
							method : 'GET',
							params : {
								moduleName : 'security',
								serviceName : 'semployee',
								methodName : 'delete',
								        id : '@id',
								random : Math.random()
							}
						    
						},
						getStdDescendants : {
							method : 'POST',
							params : {
								moduleName : 'security',
								serviceName : 'stdorgan',
								methodName : 'getStdDescendants',
								stdorganId : '@stdorganId',
								random : Math.random()
							},
						 isArray : true
						},
						saveEmployee : {
							method : 'POST',
							params : {
								moduleName : 'security',
								serviceName : 'employee',
								methodName : 'save',
								//stdorgan : '@stdorgan',
								random : Math.random()
							}
						},
						savePhoto : {
							method : 'POST',
							params : {
								moduleName : 'security',
								serviceName : 'photo',
								methodName : 'save',
								random : Math.random()
							}
						},
						getAllStds:{
							method : 'get',
							params : {
								moduleName : 'security',
								serviceName : 'stdorgan',
								methodName : 'getAllStds',
								//stdorgan : '@stdorgan',
								random : Math.random()
							},
							isArray:true
						},
						getStdorganTree:{
							method : 'get',
							params : {
								moduleName : 'security',
								serviceName : 'stdorgan',
								methodName : 'getStdorganTree',
								        id :'@id',
								    random : Math.random()
							}
						},
						getPhoto:{
							method : 'get',
							params : {
								moduleName :  'security',
								serviceName:  'photo',
								methodName :  'getPhoto',
								        id :  '@id',
								    random : Math.random()
							}
						},
						addAccount:{
							method : 'post',
							params : {
								moduleName :  'security',
								serviceName:  'account',
								methodName :  'save',
								    random : Math.random()
							}
						},
						getAccountByUserName:{
							method : 'get',
							params : {
								moduleName :  'security',
								serviceName:  'account',
								methodName :  'getByUserName',
								username   :  '@username',
								    random : Math.random()
							}
						},
						getAccountByEmployeeId:{
							method : 'get',
							params : {
								moduleName :  'security',
								serviceName:  'account',
								methodName :  'getByEmployeeId',
								employeeId   :  '@employeeId',
								    random : Math.random()
							}
						},
						changeAccount:{
							method : 'post',
							params : {
								moduleName :  'security',
								serviceName:  'account',
								methodName :  'change',
								    random : Math.random()
							}
						}
						

					});
					return resource;
				} ]);



/*----------------------机构对应人员Ctrl---------------------*/
var stdorganEmployeeNgCtrl = stdorganEmployeeNgModule
		.controller(
				'stdorganEmployeeNgCtrl',
				function($scope, $stateParams, $http, $modal,
						$state, $rootScope, $window, $cookieStore, $log,employeeService,httpService
						) {
					/*-------------------------jstree机构树-----------------------*/
					    $scope.initTree = function () {
					        $('#treeview').jstree({
					            'plugins': [ 'changed', 'wholerow', 'types', 'contextmenu' ],
					            // 'plugins': [ 'checkbox', 'contextmenu', 'dnd', 'massload', 'search', 'sort', 'state', 'types', 'unique', 'wholerow', 'changed', 'conditionalselect' ]
					            'core': {
					                'themes': {
					                    'responsive': false
					                }, 
					                'data': {
					                    'url': function (p_node) {
					                        // return '../rest/standard/architecture/children';
					                        return authPath+'/rest/security/stdorgan/getChildrenByParentId';
					                    },
					                    'data': function (p_node) {
					                        var param = { 'id': p_node.id };
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
					            'types': {
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
					        });

					        //选中得节点
					        $('#treeview').on('select_node.jstree', function(p_event, p_selected) { 
					            var nodePath = $('#treeview').jstree('get_path', p_selected.node, ' | ', true);
					            //传递节点id
					            $scope.stdorganId=p_selected.node.id;
				                   //通过节点id获取后代子机构		            
						            employeeService.getStdDescendants({stdorganId:$scope.stdorganId},function(data){   		
							    			var Objstdorgan = data;
							    			var stdorgans=''
							    			for( var i=0;i<Objstdorgan.length;i++){
							    				 stdorgans +=Objstdorgan[i].id+',';
							    			
							    			}
							    		    if (stdorgans.length > 0) {
							    		    	stdorgans = stdorgans.substr(0, stdorgans.length - 1);
							    		    	//重新载入查询条件
									            $scope.instance.execute('load', {
													filter:JSON.stringify([
														   				    { name : 'deleteFlag', operator : 'Equal', value : 0},
														   					{ name : 'stdorganId', operator : 'In', value : stdorgans }				
														   					])
											    });
									        		
							    		    }    		   
							    		
						    		},function(msg){
						    			// alert(msg);
						    		});
					        });
					    };

					    $scope.updateStdOrganData = function (p_data) {
					    	
					      };

					    $scope.init = function () {
					        $scope.initTree();
					    };
					    $scope.init();
					    $rootScope.settings.layout.pageContentWhite = true;
					    $rootScope.settings.layout.pageBodySolid = false;
					    $rootScope.settings.layout.pageSidebarClosed = false; 
					   /*-------------------------jstree机构树结束-----------------------*/
					    
				    
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
					   			url:  authPath+"/rest/security/employee/getAll",//加载的URL
					   			idField: "ID",
					   			pagination: true,//显示分页
					   			pageSize: $scope.queryDto.rows || pageSize,//分页大小
					   			pageList: [5, 10, 15, 20],//每页的个数
					   			pageNumber:$scope.queryDto.page || 1,
					   			queryParams:{
					   				filter:JSON.stringify([
					   				    { name : 'deleteFlag', operator : 'Equal', value : 0},
					   					{ name : 'stdorganId', operator : 'Equal', value : $scope.stdorganId}				
					   					])
					   			},
					   			fit: true,//自动补全
					   			fitColumns: false,
					   			rownumbers:true,
					   			border: true,
					   			sortName: 'createTime',
					   			sortOrder: 'Desc',
					   			toolbar: "#GrapTextGroupListTb",
					   			scrollbarSize:0,
					   			singleSelect:true, 
					   			maxHeight:330,
					   			columns: [[//每个列具体内容
					   			    { field: 'guId', title: '员工编码',align:'center', width: 140 },
					   				{ field: 'realName', title: '真实姓名',align:'center',  width: 140 },
					   				{ field: 'identification', title: '身份证号',align:'center',  width: 200 },
					   				{ field: 'stdorganId', title: '机构id',align:'center',hidden:'true',width: 150 },
					   				{ field: 'birthday', title: '生日',align:'center',hidden:'true',width: 150 },
					   				{ field: 'group_id', title: '附件',align:'center',hidden:'true',width: 150 },
					   				{field: 'id', title: '操作', width: 240,align:'center', formatter: function (value, row, index) {
						   					
							   					var str = '';
							   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
													'ng-click="editClick(\''+index+'\')">编　辑</button>'+'&nbsp&nbsp&nbsp&nbsp';
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
					   		};//options结束
						
						
						
						//$scope.instance初始化	
						$scope.instance = null;
						$scope.init = function () {
							return function (instance) {
								$scope.instance = instance;
							};
						};
						
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
				                                  { name : 'realName', operator : 'Like', value : $scope.initQueryObj.realName},
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
							$cookieStore.put('employeeList',$scope.Parameters);

							$scope.realName="";

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
							$scope.instance.execute('options').pageNumber=$scope.initQueryObj &&  $scope.initQueryObj.page && Number($scope.initQueryObj.page);
							$scope.instance.execute('options').pageSize= $scope.initQueryObj &&  $scope.initQueryObj.rows && Number($scope.initQueryObj.rows);
							$scope.instance.execute('load', {
								filter:JSON.stringify([
				                    { name : 'deleteFlag', operator : 'Equal', value : 0 },
				                    { name : 'realName', operator : 'Like', value : $scope.realName},
				                    ])
							});
				   		};

						//删除人员事件
						$scope.goDelete = function(id) {
							if(confirm("确定删除此员工吗？")){
								$http.post(authPath+"/rest/security/employee/delete/"+id,null).success(
										
										function(data) {            										
											$scope.instance.execute('reload');
											}).error(
										function() {
											toaster.pop('error', '失败信息',
													'员工删除失败，请重试！');
										});}
							
							
						};
						
				   		// 添加人员事件
						$scope.addClick = function(stdorganid) {
							var modalInstance = $modal
									.open({
										animation : true,
										backdrop : false,
										templateUrl : 'modules/auth/org/employee/employeeAdd.html',
										controller : 'employeeAddCtrl',
										size : 'lg',
										resolve : {
											employeeStdId : function() {								
											return 	$scope.stdorganId;
											},
											stdorgans : function(){
											    return httpService
												.get({
													url : authPath+'/rest/security/stdorgan/getAllStds'
															
												});	
											},
											stdorganTree:function(){
												return httpService
												.get({
													url : authPath+'/rest/security/stdorgan/getStdorganTree'
															
												});		
											}
										}
									});

							modalInstance.result.then(function() {
								$scope.reloadgrid();
							}, function() {
								$log.info('Modal dismissed at: ' + new Date());
							});
						}
						
						// 编辑人员事件
						$scope.editClick = function(index) {
							var modalInstance = $modal
									.open({
										animation : true,
										backdrop : false,
										templateUrl : 'modules/auth/org/employee/employeeAdd.html',
										controller : 'employeeEditCtrl',
										size : 'lg',
										resolve : {
											employeeData: function() {								
											return 	 $scope.instance.execute('getData').rows[index];
											},
											stdorgans : function(){
											    return httpService
												.get({
													url : authPath+'/rest/security/stdorgan/getAllStds'
															
												});	
											},
											stdorganTree:function(){
												return httpService
												.get({
													url : authPath+'/rest/security/stdorgan/getStdorganTree'
															
												});		
											}
										}
									});

							modalInstance.result.then(function() {
								$scope.reloadgrid();
							}, function() {
								$log.info('Modal dismissed at: ' + new Date());
							});
						}
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
						
				    // set sidebar closed and body solid layout mode
				    $rootScope.settings.layout.pageContentWhite = true;
				    $rootScope.settings.layout.pageBodySolid = false;
				    $rootScope.settings.layout.pageSidebarClosed = false; 
				    //员工datagrid结束		    
					
});//stdorganEmployeeNgCtrl结束

/*---------------添加人员Ctrl------------------------*/
var employeeAddCtrl = stdorganEmployeeNgModule.controller('employeeAddCtrl', [
                  		'$scope', '$modalInstance', 'employeeService','employeeStdId','FileUploader','stdorganTree','$window','$state',
                  		function($scope, $modalInstance,employeeService,employeeStdId,FileUploader,stdorganTree,$window,$state) {
                  			$scope.load = function(){
                				
                			};
                  		  $scope.title = '添加子机构';
                  		  $scope.accountName="新加账户";
                  		  $scope.$watch('$viewContentLoaded', function() {  
                  		  // 初始化时间选择框
                 				$('.date-picker').datepicker({
                 					rtl : App.isRTL(),
                 					orientation : "left",
                 					autoclose : true
                 				});            				
                 				
                          });  
                  			//性别
                  			$scope.genders = [{id : 'male', name : '男'},{id : 'female', name : '女'}];
                  			$scope.employee={gender:'male'};
							//个人信息保存事件
                  			$scope.confirm = function(o) {
                  				if (o == false) {
                  					return;
                  				}
                  				var employee = {
                  					id : '',
                  					//stdorganId:employeeStdId,
                  					guId :$scope.employee.guId,
                  					realName : $scope.employee.realName,
                  					nickName : $scope.employee.nickName,
                  					spell : $scope.employee.spell,
                  					former : $scope.employee.former,
                  					gender : $scope.employee.gender,
                  					identification : $scope.employee.identification,
                  					birthday :$scope.birthday,//Date.parse( $scope.employee.birthday)
                  					birthPlace : $scope.employee.birthPlace,
                  					nation : $scope.employee.nation,
                  					telephone:$scope.employee.telephone,
                  					mobile:$scope.employee.mobile,
                  					fax:$scope.employee.fax,
                  					email:$scope.employee.email,
                  					remark:$scope.employee.remark
                  				};
                  				//初始化,保存后回调得员工信息
                  				$scope.savedEmployee={
                  						id : ""
                  				}
                  				employeeService.saveEmployee(employee, function(data) {
                  					$scope.savedEmployee=data;
                  					console.log(data);
                  					if($scope.savedEmployee.id!=""){
                  						 alert("员工保存成功,继续保存其他信息！");
                  						 //document.getElementById('selectStd').click();
                  					}else{
                  						alert("员工保存失败！");
                  						 document.getElementById('personal').click();
                  					} 
                  					
                  				});

                  			};

                  			$scope.cancel = function(organization) {
                  				//$modalInstance.dismiss('cancel');
                  				$modalInstance.close();
                  			};
               /*-------------------------添加机构选择树-------------------------------*/
      //取得已选机构树信息			
      employeeService.getStdorganTree({id:employeeStdId},function(data){        			
                  		    $scope.addStdorganTree=data;	
  			$scope.$watch('name', function() {
  				   
  					if($scope.name=='name2'){    					    
    					        $('#stdTreeview').jstree({
    					            'plugins': [ 'changed', 'wholerow', 'types', 'contextmenu','checkbox','themes'],
    					            // 'plugins': [ 'checkbox', 'contextmenu', 'dnd', 'massload', 'search', 'sort', 'state', 'types', 'unique', 'wholerow', 'changed', 'conditionalselect' ]
    					         "themes" :{
    					        	 "theme" : "default",
    					        	 "dots" : true,      
    					            },
    					            'core': {
    					            	 'multiple' : false,
	    					                'data'  : $scope.addStdorganTree,
	    					              'strings' : {  
	    					                    'Loading ...': '正在加载...'  
	    					                }, 
    					            },
    					            "checkbox":{
    					                "tie_selection":true,
    					                "keep_selected_style":false,
    					                "three_state": false,
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
    					            'types': {
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
    					        });
    					        
    					        // handle link clicks in tree nodes(support target='_blank' as well)
    					        $('#stdTreeview').on('select_node.jstree', function(p_event, p_selected) { 
    					            var nodePath = $('#treeview').jstree('get_path', p_selected.node, ' | ', true);
    					            $scope.stdorganId=p_selected.node.id;
    					        });
    					        //点击ok事件,保存选择机构
    					    	$scope.ok = function() {
    					    		 var nodes=$("#stdTreeview").jstree("get_checked");
    					    		 //$scope.savedEmployee员工
    					    		 if( $scope.savedEmployee.id!=""){
    					    			 employeeService.getEmployeeById({id:$scope.savedEmployee.id},function(data){
    					    				 employeeEdit=data;
    					    				 employeeEdit.stdorganId=nodes[0];
        					    			 //保存员工
        					    			 employeeService.saveEmployee(employeeEdit, function(data) {});
    					    			 },function(msg){
    							    			return msg;
    							    		});
    					    			 alert("机构保存成功，继续保存其他信息！");
    					    			// document.getElementById('uploadImg').click();
    					    		 }else{
    					    			 alert("请先填写员工个人信息！");
    					    		 }
    							}
                                // 取消事件
    					    	$scope.cancel = function() {
                      				//$modalInstance.dismiss('cancel');
    					    		$modalInstance.close();
                      			};
  					}//if结束
  			});
      });	
 /*-------------------------添加机构树结束-----------------------*/    
                  					 
                  			                    			                  			
                  		/*--------------------------添加上传图片-----------------------------*/
  			               $scope.currentItem = {css:'current',messageIndex:-1,messageType:"1",imgUrl:"../assets/global/img/default-img.png"};
  			               var handlerFileSelect=function() {
					        	angular.element(document.querySelector('#imgFile')).click();
							    };
							//angular.element(document.querySelector('#imgBtnFile')).on('click',handlerFileSelect);
							$scope.imgButton=function(obj){
								handlerFileSelect();
							}
  			           
							//页面输出信息
							$scope.files=[];
							// 创建附件上传控件
							var uploader = $scope.uploader = new FileUploader({
								url : authPath+'/rest/security/photo/uploadPic',
							});
							 uploader.onAfterAddingFile = function(fileItem) {
								 var extension=fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toUpperCase();
								 if(extension!=".BMP"&&extension!=".GIF"&&extension!=".JPEG"
									 &&extension!=".JPEG2000"&&extension!=".TIFF"&&extension!=".PSD"&&extension!=".PNG"
										 &&extension!=".SWF"&&extension!=".SVG"&&extension!=".JPG"){
									 toaster.pop('warning', '提示信息',
										'请选择图片类型');
									 $scope.delQueueByName(fileItem.file.name);
								 }
								 else{
									 fileItem.upload();
								 }
							    };
							    $scope.delQueueByName=function(name){
							    	 var index = -1;
					     				for (i = 0; i < uploader.queue.length; i++) {
					     					if (uploader.queue[i].name == name) {
					     						index = i;
					     					}
					     				}
					     				uploader.queue.splice(index, 1);
							    }
							    uploader.onCompleteItem = function(fileItem,
										response, status, headers) {
									 $scope.setFile(fileItem,response);
								};
								$scope.setFile = function(fileItem,url) {
									var file = {
											name : fileItem.file.name,
											path : url[0],
											smallPath:url[1],
											extension : fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.') + 1),
											uploadDate : fileItem.file.lastModifiedDate,//
											fileSize:fileItem.file.size,
										};
									//需要保存得照片信息
									 $scope.addPhoto={
											 id  : '',
											name : url[2],
											path : url[0],
											extension : fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.') + 1),
											deleteFlag:'0'
										}
									$scope.files.push(file);
									$scope.currentItem.imgUrl = file.path;
								}
								$scope.delPic=function(obj){
									$scope.currentItem.imgUrl = "";

								}
								
							//图片上传确定事件
							$scope.saveImg= function() {
								employeeService.savePhoto($scope.addPhoto, function(data) {
                  					$scope.savedPhoto=data;
	                  					if( $scope.savedEmployee.id!=""){
		   					    			 employeeService.getEmployeeById({id:$scope.savedEmployee.id},function(data){
		   					    				 employeeEdit=data;
		   					    				 employeeEdit.groupId=$scope.savedPhoto.id;
		       					    			 //保存员工
		       					    			 employeeService.saveEmployee(employeeEdit, function(data) {});
		                  					     alert("图片上传成功，继续保存其他信息！")
	                  				         });
							              }else{
							            	  alert("请先填写员工信息");
							              }
								});
								//document.getElementById('changeAccount').click();
							}			
							//图片上传取消事件
							$scope.cancelImg = function() {
								//$modalInstance.dismiss('cancel');
								$modalInstance.close();
							}
				/*--------------------------添加人员Ctrl上传图片结束-----------------------------*/
			   /*--------------------------添加人员Ctrl添加账户-----------------------------*/
		$scope.$watch('accountInit', function(newValue,oldValue) { 	
			if(newValue=='a1'){
					    //初始化页面
						$scope.userNameEdit=false;
						$scope.passWordName="密码";
						$scope.newPassWordShow="none";
						$scope.userNameStatus="必填";
						$scope.passWordStatus="必填";
						$scope.NewPassWordStatus="必填";
						$scope.repeatPassWordStatus="必填";
						$scope.disStatus=true;
						console.log("aaa");
						console.log($scope.savedEmployee);
			
						$scope.account={
								userName : $scope.userName,
								password : $scope.passWord,
								salt     : "",
							  employeeid : $scope.savedEmployee.id,
						}
					 $scope.$watch('passWord', function(newValue2,oldValue2) {
						 if(newValue2!=oldValue2){
								$scope.account={
											userName : $scope.userName,
											password : $scope.passWord,
											salt     : "",
										  employeeid : $scope.savedEmployee.id,
									}
						 }	
					 });
		
				//验证两处密码是否一致
				$scope.checkRepeat= function() {
					if($scope.passWord==$scope.repeatPassWord){
						$scope.repeatPassWordStatus="密码一致，可用";
						return true;
					}else{
						$scope.repeatPassWordStatus="两次密码不一致，请重新填写";
						return false;
					}
				}	
					//验证账户是否已经存在
					$scope.checkUserName= function() {
							employeeService.getAccountByUserName({username:$scope.userName},function(data){
			    				if(data.userName==undefined){
			    					$scope.userNameStatus="账户名可以使用";
			    					return true;
			    				}else{
			    					$scope.userNameStatus="账户名已存在，请更换";
			    					return false;
			    				}
					         });
					}
					//保存账户
				  $scope.$watch('userNameStatus', function(newValue,oldValue) {	
						$scope.saveAccount= function(o) {
					       if($scope.checkRepeat() && newValue=="账户名可以使用" && $scope.account!=undefined){	
							   employeeService.addAccount($scope.account,function(data){
						    			  if(data!=null){
						    				alert("账户保存成功");
						    				$modalInstance.close();
						    			  }else{
										    	 alert("账户保存失败，请看是否有提示错误")
										     }
							   }); 	
						   }else if($scope.account==undefined) {
						    	 alert("账户保存失败，请先保存个人信息")
						   }else if(newValue!="账户名可以使用") {
						    	 alert("账户保存失败，账户名不可用")
						   }else if(!$scope.checkRepeat()) {
						    	 alert("账户保存失败，两次密码不一致")
						   }
					   }
				  });//watch
			}	  
		  });//watch
		//新加账户结束
        } ]);

/*--------------------------------------编辑人员Ctrl--------------------------------------------*/
var employeeEditCtrl = stdorganEmployeeNgModule.controller('employeeEditCtrl', [
                  		'$scope', '$modalInstance', 'employeeService','employeeData','FileUploader','$window','$state',
                  		function($scope, $modalInstance,employeeService,employeeData,FileUploader,$window,$state) {
                			
                	      //employeeData为编辑母模版传过来得员工数据
                  		  $scope.title = '添加子机构';
                  		$scope.accountName="修改账户";
                  		  $scope.$watch('$viewContentLoaded', function() {  
                  			// 初始化时间选择框
                 				$('.date-picker').datepicker({
                 					rtl : App.isRTL(),
                 					orientation : "left",
                 					autoclose : true
                 				});            				
                 				
                          });  
                  			//性别
                  			$scope.genders = [{id : 'male', name : '男'},{id : 'female', name : '女'}];
                  			 $scope.employee=employeeData;
                  			 $scope.$watch('$viewContentLoaded', function() {  
	                  				//字符串转日期
	                       			$scope.convertDateToString =function() {
	     	                  		    var value=new Date(Date.parse(employeeData.birthday.replace(/-/g, "/")));
	     	                  		    $scope.birthday=moment(value).format("YYYY-MM-DD");
	                       		    }();          				
	                  				
                               });
							//个人信息保存事件
                  			$scope.confirm = function(o) {
                  				if (o == false) {
                  					return;
                  				}
                  				var p = {
                      					id : $scope.employee.id == undefined ? "" :$scope.employee.id,
                      					//stdorganId:$scope.employee.stdorganId == undefined ? "" :$scope.employee.stdorganId,
                      					guId :$scope.employee.guId == undefined ? "" :$scope.employee.guId,
                      					realName : $scope.employee.realName == undefined ? "" :$scope.employee.realName,
                      					nickName : $scope.employee.nickName == undefined ? "" :$scope.employee.nickName,
                      					spell : $scope.employee.spell == undefined ? "" :$scope.employee.spell,
                      					former : $scope.employee.former == undefined ? "" :$scope.employee.former,
                      					gender : $scope.employee.gender == undefined ? "" :$scope.employee.gender,
                      					identification : $scope.employee.identification == undefined ? "" :$scope.employee.identification,
                      					birthday : $scope.employee.birthday == undefined ? "" : $scope.birthday,
                      					birthPlace : $scope.employee.birthPlace == undefined ? "" : $scope.employee.birthPlace,
                      					nation : $scope.employee.nation == undefined ? "" :$scope.employee.nation,
                      					telephone:$scope.employee.telephone == undefined ? "" :$scope.employee.telephone,
                      					mobile:$scope.employee.mobile == undefined ? "" :$scope.employee.mobile,
                      					fax:$scope.employee.fax == undefined ? "" :$scope.employee.fax,
                      					email:$scope.employee.email == undefined ? "" :$scope.employee.email,
                      					remark:$scope.employee.remark == undefined ? "" :$scope.employee.remark
                      				};
                  				employeeService.saveEmployee(p, function(data) {
                  					$scope.savedEmployee=data;
                  					if($scope.savedEmployee!=null && $scope.savedEmployee!=undefined){
                  						 alert("员工信息修改成功！")
                  						 //document.getElementById('selectStd').click();
                  						 
                  					}else{
                  						alert("员工保存失败！")
                  					}
                  					
                  				});

                  			};

                  			$scope.cancel = function(organization) {
                  				//$modalInstance.dismiss('cancel');
                  				$modalInstance.close();
                  			};
                  			
               /*-------------------------编辑机构选择树-------------------------------*/
              //得到机构选择树    			
               employeeService.getStdorganTree({id:employeeData.stdorganId},function(data){
            	   $scope.editStdorganTree=data;
            	   $scope.$watch('name', function() {
     				    
     					if($scope.name=='name2'){    					    
       					        $('#stdTreeview').jstree({
       					            'plugins': [ 'changed', 'wholerow', 'types', 'contextmenu','checkbox','themes'],
       					            // 'plugins': [ 'checkbox', 'contextmenu', 'dnd', 'massload', 'search', 'sort', 'state', 'types', 'unique', 'wholerow', 'changed', 'conditionalselect' ]
       					         "themes" : {
   		    					        	 "theme" : "default",
   		    					        	 "dots" : true,      
       					            },
       					            'core': {
       					            	    'multiple' : false,
   	    					                'data'  : $scope.editStdorganTree,
   	    					                 'strings' : {  
   	    					                    'Loading ...': '正在加载...'  
   	    					                }, 
       					            },
       					         "checkbox":{
   	    					                "tie_selection":true,
   	    					                "keep_selected_style":false,
   	    					                "three_state": false,
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
       					            'types': {
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
       					        });
       					    
       					        $('#stdTreeview').on('select_node.jstree', function(p_event, p_selected) { 
       					            var nodePath = $('#treeview').jstree('get_path', p_selected.node, ' | ', true);
       					            $scope.stdorganId=p_selected.node.id;
       					        });
       					     
       					        //点击ok事件,保存选择得机构
       					    	$scope.ok = function(o) {
       					    		if (o == false) {
                         					return;
                         				}
       					    		 var nodes=$("#stdTreeview").jstree("get_checked");
       					    		 //$scope.savedEmployee员工
       					    			 employeeService.getEmployeeById({id:employeeData.id},function(data){
       					    				 employeeEdit=data;
       					    				 employeeEdit.stdorganId=nodes[0];
           					    			 //保存员工
           					    			 employeeService.saveEmployee(employeeEdit, function(data) {
           					    			 });
           					    			 alert("机构保存成功！");
           					    			 //document.getElementById('uploadImg').click();
	       					    			   },function(msg){
	       							    		 	return msg;
       							    	});
       							}
                                // 取消事件
       					    	$scope.cancel = function() {
                         				//$modalInstance.dismiss('cancel');
       					    		      $modalInstance.close();
                         			};
     					}//if结束
     			});
     			//qwe
	  },function(msg){
		    			return msg;
		    		});//得到机构选择树结束    
   /*-------------------------编辑jstree机构树结束-----------------------*/    
                  					 
                  /*--------------------------编辑上传图片-----------------------------*/
				 //通过员工groupId取得照片信息
            	 employeeService.getEmployeeById({id:employeeData.id},function(data){
            		if(data.groupId !=null ){  
            		   employeeService.getPhoto({id:data.groupId},function(data){
    	    			   $scope.currentItem = {css:'current',messageIndex:-1,messageType:"1",imgUrl:data.path};
    	    			   $scope.addPhoto={
    								 id  : data.id,
    								name : data.name,
    								path : data.path,
    								extension : data.extension, 
    								deleteFlag:'0'
    							}
    	    			 },function(msg){
    			    			return msg;
    			    		});
                	   
            		}else{
    		            $scope.currentItem = {css:'current',messageIndex:-1,messageType:"1",imgUrl:"../assets/global/img/default-img.png"};

                    }   
            	  });  
            	  
			  			  //图片选择按钮事件
			               var handlerFileSelect=function() {
					        	angular.element(document.querySelector('#imgFile')).click();
							    };
							//angular.element(document.querySelector('#imgBtnFile')).on('click',handlerFileSelect);
							$scope.imgButton=function(obj){
								handlerFileSelect();
							}
			           
							//页面输出信息
							$scope.files=[];
							// 创建附件上传控件
							var uploader = $scope.uploader = new FileUploader({
								url : authPath+'/rest/security/photo/uploadPic',
							});
							 uploader.onAfterAddingFile = function(fileItem) {
								 var extension=fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toUpperCase();
								 if(extension!=".BMP"&&extension!=".GIF"&&extension!=".JPEG"
									 &&extension!=".JPEG2000"&&extension!=".TIFF"&&extension!=".PSD"&&extension!=".PNG"
										 &&extension!=".SWF"&&extension!=".SVG"&&extension!=".JPG"){
									 toaster.pop('warning', '提示信息',
										'请选择图片类型');
									 $scope.delQueueByName(fileItem.file.name);
								 }
								 else{
									 fileItem.upload();
								 }
							    };
							    $scope.delQueueByName=function(name){
							    	 var index = -1;
					     				for (i = 0; i < uploader.queue.length; i++) {
					     					if (uploader.queue[i].name == name) {
					     						index = i;
					     					}
					     				}
					     				uploader.queue.splice(index, 1);
							    }
							    uploader.onCompleteItem = function(fileItem,
										response, status, headers) {
									 $scope.setFile(fileItem,response);
								};
								$scope.setFile = function(fileItem,url) {
									var file = {
											name : fileItem.file.name,
											path : url[0],
											smallPath:url[1],
											extension : fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.') + 1),
											uploadDate : fileItem.file.lastModifiedDate,//
											fileSize:fileItem.file.size,
										};
									//需要保存得照片信息
									 $scope.addPhoto={
											 id  : '',
											name : url[2],
											path : url[0],
											extension : fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.') + 1),
											deleteFlag:'0'
										}
									$scope.files.push(file);
									$scope.currentItem.imgUrl = file.path;
								}
								$scope.delPic=function(obj){
									$scope.currentItem.imgUrl = "";
			
								}
								
							//图片上传确定事件
							$scope.saveImg= function() {
								employeeService.savePhoto($scope.addPhoto, function(data) {
			    					$scope.savedPhoto=data;
					    			 employeeService.getEmployeeById({id:employeeData.id},function(data){
					    				 employeeEdit=data;
					    				 employeeEdit.groupId=$scope.savedPhoto.id;
 					    			 //保存员工
 					    			 employeeService.saveEmployee(employeeEdit, function(data) {});
			            					     
			        				         });
							            
								});
								 //$modalInstance.close();
								//$state.go('stdorganEmployee');
								alert("图片修改成功，可以继续修改其他信息!");
							}			
							//图片上传取消事件
							$scope.cancelImg = function() {
								//$modalInstance.dismiss('cancel');
								$modalInstance.close();
							}
						/*--------------------------编辑人员Ctrl上传图片结束-----------------------------*/
			/*--------------------------编辑修改账户-----------------------------*/
							$scope.$watch('accountInit', function(newValue1,oldValue1) { 	
								if(newValue1=='a1'){
								   //初始化页面
								$scope.userNameStatus="必填";
								$scope.passWordStatus="必填";
								$scope.NewPassWordStatus="必填";
								$scope.repeatPassWordStatus="必填";
								$scope.disStatus=true;
								//$scope.username回显值
								employeeService.getAccountByEmployeeId({employeeId:employeeData.id},function(data){
									 $scope.userName=data.userName;
									 //判断此员工是否拥有账户
									 if(data.userName==undefined){
										 $scope.passWordName="密码";
										 $scope.newPassWordShow="none";
										 $scope.userNameStatus="该员工无账户，可以添加账户";
									 }else{
										 $scope.passWordName="原密码";
										 $scope.newPassWordShow="block";
									 }
								});
								
							     //监听页面新密码
								 $scope.$watch('newPassWord', function(newValue,oldValue) {
									 if(newValue!=undefined){
											$scope.changeAccount={
													   employeeid:employeeData.id,
														userName : $scope.userName,
														oldPassword : $scope.passWord,
														newPassword : $scope.newPassWord
													    
												}
											$scope.newAccount={
													userName : $scope.userName,
													password : $scope.passWord,
													salt     : "",
												  employeeid : employeeData.id,	
											}
									 }	
								 });
								  //监听页面账户名
								 $scope.$watch('userName', function(newValue,oldValue) {
									 if(newValue!=undefined){
										 $scope.changeAccount={
												   employeeid:employeeData.id,
													userName : $scope.userName,
													oldPassword : $scope.passWord,
													newPassword : $scope.newPassWord
											}
										$scope.newAccount={
												userName : $scope.userName,
												password : $scope.passWord,
												salt     : "",
											  employeeid : employeeData.id,	
										}
									 }	 
								 });
							     //监听页面原密码
								 $scope.$watch('passWord', function(newValue,oldValue) {
									 if(newValue!=undefined){
										 $scope.changeAccount={
												   userName : $scope.userName,
												   employeeid:employeeData.id,
													oldPassword : $scope.passWord,
													newPassword : $scope.newPassWord
												    
											}
										$scope.newAccount={
												userName : $scope.userName,
												password : $scope.passWord,
												salt     : "",
											  employeeid : employeeData.id,	
										}	
									 }	
								 });
								
								   //验证账户是否已经存在
									 $scope.checkUserName= function() {
											employeeService.getAccountByUserName({username:$scope.userName},function(data){
							    				if(data.userName==undefined){
							    					$scope.userNameStatus="账户名可以使用";
							    					return true;
							    				}else{
							    					employeeService.getAccountByEmployeeId({employeeId:employeeData.id},function(data){
							    						if(data.userName==$scope.userName){
							    							$scope.userNameStatus="账户名为原账户名";
									    					return true;
							    						}else{
							    							$scope.userNameStatus="账户名已存在,请更换";
									    					return false;
							    						}
							    					})
							    					
							    				}
									         });
									}
							
									//验证更改账户两处密码是否一致
									$scope.checkRepeat= function() {
										 $scope.$watch('newPassWord', function() {
											 //通过有无新密码判断重复
											if($scope.newPassWord!=undefined ){
												if($scope.newPassWord==$scope.repeatPassWord){
													$scope.repeatPassWordStatus="密码一致,可用";
													return true;
												}else{
													$scope.repeatPassWordStatus="两次密码不一致，请重新填写";
													return false;
												}
												
											}else{
												if($scope.passWord==$scope.repeatPassWord){
													$scope.repeatPassWordStatus="密码一致,可用";
													return true;
												}else{
													$scope.repeatPassWordStatus="两次密码不一致，请重新填写";
													return false;
												}
											} 
										 });
									}
								
									//通过员工Id取得该账户
									$scope.checkPassword= function() {
												employeeService.getAccountByEmployeeId({employeeId:employeeData.id},function(data){
													$scope.$watch('newPassWord', function() {
														if(data.password!=undefined){
															if($scope.passWord==data.password){
																$scope.passWordStatus="原密码正确";
															}else{
																$scope.passWordStatus="原密码错误";
														        }
														}	
													});	
										         });
									}
									//保存账户
									$scope.saveAccount= function(o) {
										//根据有无新密码判断是更改账户还是新账户
										$scope.$watch('newPassWord', function(newValue,oldValue) {
											 if(newValue!=undefined){
												 //有新密码是更改账户
												 if( $scope.newPassWord!=undefined ){
													 if($scope.repeatPassWordStatus=="密码一致,可用"  && $scope.changeAccount!=undefined && $scope.passWordStatus=="原密码正确"){
												    	   employeeService.changeAccount ($scope.changeAccount,function(data){
												    		   if(data.error=="用户账户更改成功"){
												    			   alert(data.error);
												    			   $modalInstance.close();
												    		   }else{
												    			   alert(data.error);
												    			     $scope.newPassWord="";
																     $scope.passWord="";
																     $scope.repeatPassWord="";
												    		   }
												    	   });
											    	   
											         }else if($scope.repeatPassWordStatus!="密码一致,可用"){
											        	 alert("更改账户失败，两次密码不一致");
											        	 $scope.newPassWord="";
											        	 $scope.repeatPassWord="";
											         }else if($scope.passWordStatus!="原密码正确"){
											        	 alert("更改账户失败，原密码错误");
											        	  $scope.newPassWord="";
														  $scope.passWord="";
														  $scope.repeatPassWord="";
											         } 
												 }
											//否则是新账户	 
											 }else{
												 $scope.$watch('userNameStatus', function(newValue2,oldValue2) {		 
													 if($scope.repeatPassWordStatus =="密码一致,可用" && newValue2=="账户名可以使用" ){	
														   employeeService.addAccount($scope.newAccount,function(data){
													    			  if(data!=null){
													    				alert("账户保存成功");
													    				$modalInstance.close();
													    			  }else{
																	    	 alert("账户保存失败，请看是否有提示错误")
																	     }
														   }); 	
													   }else if(newValue2!="账户名可以使用") {
													    	 alert("账户保存失败，账户名不可用")
													    	 $scope.userName="";
															  $scope.passWord="";
															  $scope.repeatPassWord="";
													   }else if(!$scope.checkRepeat()) {
													    	 alert("账户保存失败，两次密码不一致")
													    	 $scope.passWord="";
															 $scope.repeatPassWord="";
													   }
												 }); 
											 }	
										 });
								   }
								 }//if	  
							  });//watch
			/*--------------------------编辑修改账户结束-----------------------------*/
							
                  		} ]);
/*---------------编辑人员Ctrl结束------------------------*/

/*---------------CarouselDemoCtrl------------------------*/
stdorganEmployeeNgModule.controller('CarouselDemoCtrl', ['$scope', function($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'img/c' + slides.length + '.jpg',
        text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
      });
    };
    for (var i=0; i<4; i++) {
      $scope.addSlide();
    }
  }])

