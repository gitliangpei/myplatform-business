var stdorganNgModule = angular.module('example.stdwj', [
		'ngResource', 'ngCookies', 'toaster' ]);

var moduleService = stdorganNgModule
		.factory(
				'moduleService',
				[
						'$resource',
						function($resource) {
							var path = authPath+'/rest/:moduleName/:serviceName/:methodName?rnd=:random';
							var resource = $resource(path, {}, {
								get : {
									method : 'GET',
									params : {
										moduleName : 'security',
										serviceName : 'stdorgan',
										methodName : 'getByEZModuleQuery',
										random : Math.random()
									},
									isArray : true
								},
								findOneById : {
									method : 'GET',
									params : {
										moduleName : 'security',
										serviceName : 'stdorgan',
										methodName : 'findOneById',
										stdorganid : '@stdorganid',
										random : Math.random()
									}
								},
								save : {
									method : 'POST',
									params : {
										moduleName : 'security',
										serviceName : 'stdorgan',
										methodName : 'save',
										stdorgan : '@stdorgan',
										total : '@total',
										random : Math.random()
									}
								},
								saveWorkjob : {
									method : 'POST',
									params : {
										moduleName : 'security',
										serviceName : 'workjob',
										methodName : 'save',
										workjob : '@workjob',
										total : '@total',
										random : Math.random()
									}
								},
								del : {
									method : 'POST',
									params : {
										moduleName : 'security',
										serviceName : 'stdorgan',
										methodName : 'delete',
										rowId : '@rowId',
										random : Math.random()
									}
								}

							});
							return resource;
						} ]);


var stdorgan_workjob_listNgCtrl = stdorganNgModule
		.controller(
				'stdorgan_workjob_listNgCtrl',
				function($scope, httpService, $stateParams, $http, $modal,
						$state, $rootScope, $window, $cookieStore, $log,
						moduleService) {
					
					$scope.tempStr = 0;
					if ($stateParams.currentPage) {
						$scope.tempStr = Number($stateParams.currentPage);
					}
					// 解析url中的查询条件
					(function() {
						$scope.cookieUrl = $cookieStore.get("moduleList");
						$scope.initQueryObj = {};
						//console.log($scope.cookieUrl);
						if ($scope.cookieUrl) {
							var arr = $scope.cookieUrl.split('&');
							for (var i = 0; i < arr.length; i++) {
								var son_arr = arr[i].split('=');
								$scope.initQueryObj[son_arr[0]] = son_arr[1];
							}
						}
					})();
					// 初始化查询条件
					(function() {
						$scope.queryDto = {
								moduleName : $scope.initQueryObj
									&& $scope.initQueryObj.moduleName
						};
					})();
					
					// 查询按钮
					/*$scope.query = function() {

						$scope.getPageParams();
						
						$state.go('stdwj', {
							currentPage : $scope.tempStr
						});
					};*/
					// 清空按钮
					$scope.doClear = function() {
						$cookieStore.put('moduleList', $scope.str);
						$scope.tempStr = $scope.tempStr + 1;
						$state.go('stdwj', {
							currentPage : $scope.tempStr
						});
					};
					$scope.options = {
						url : authPath+"/rest/security/stdorgan/getAll",
						border : false,
						toolbar : "#moduleListTb",
						rownumbers : true,
						fit : true,// 自动补全
						fitColumns :true,
						queryParams : {
							filter : JSON.stringify([ 
							{name : 'name',operator : 'Like',value : $scope.queryDto.moduleName},
							{ name : 'deleteFlag', operator : 'Equal', value : 0},
							])
						},
						rownumbers : true,
						sortName: 'displaynum',
			   			sortOrder: 'Asc',
						idField : 'id',
						treeField : 'name',
						parentField : 'parentstdorganid',
						frozenColumns:[[
									    {field: 'name', title: '名称', width: 260}
									]],
						columns : [ [
								{
									field : 'abbr',
									title : '简称',
									width : 125
								},
								{
									field : 'type',
									title : '类型',
									width : 125
								},
								{
									field : 'stdcode',
									title : '基准编码',
									width : 125
								},
								{
									field : 'displaynum',
									title : '顺序',
									width : 125
								},
								{
									field : 'spell',
									title : '拼写',
									width : 125,
									hidden:true
								},
								{
									field : 'caozuo',
									title : '操作',
									width : 220,
									formatter : function(value, row, index) {
									
															
								      if (row.children) {
								    	 			
								    	  var html = '<button  type="button" class="btn btn-primary btn-xs"'
												+ 'ng-click="addClick(\''
												+ row.id
												+ '\')">添加</button>'
												+ '&nbsp&nbsp&nbsp&nbsp'
												+ '<button  type="button" class="btn btn-info btn-xs" ng-click="editClick(\''
												+ row.id
												+ '\')">编辑</button>';
												
										    } else {
										    	
										    	  if(row.parentstdorganid!=null && row.parentstdorganid!=""){
										    			var html = '<button  type="button" class="btn btn-primary btn-xs"'
														    + 'ng-click="addClick(\''
														    + row.id
														    +'\')">添加</button>'
															+ '&nbsp&nbsp&nbsp&nbsp'
															+ '<button  type="button" class="btn btn-info btn-xs" ng-click="editClick(\''
															+ row.id
															+ '\')">编辑</button>'
															+ '&nbsp&nbsp&nbsp&nbsp'
															+ '<button  type="button" class="btn btn-danger btn-xs" ng-click="deleteClick(\''
															+ row.id
															+ '\')">删除</button>';
												  }else{
													var html = '<button  type="button" class="btn btn-primary btn-xs"'
														    + 'ng-click="addClick(\''
														    + row.id
														    +'\')">添加</button>'
															+ '&nbsp&nbsp&nbsp&nbsp'
															+ '<button  type="button" class="btn btn-info btn-xs" ng-click="editClick(\''
															+ row.id
															+ '\')">编辑</button>';
															}
															
										}
										return html;
									}
								}

						] ]
					}
					$scope.instance = null;
					$scope.init = function() {
						return function(instance) {
							$scope.instance = instance;
						};
					};
					$scope.reloadgrid = function() {
						$scope.instance.execute('reload');
					};

					$scope.getPageParams = function() {
						if ($scope.moduleName) {
							$scope.str += '&name=' + $scope.moduleName;
						}
						$cookieStore.put('moduleList', $scope.str);
						$scope.tempStr = $scope.tempStr + 1;

					};
					// 添加机构事件
					$scope.addClick = function(stdorganid) {
						var modalInstance = $modal
								.open({
									animation : true,
									backdrop : false,
									templateUrl : 'modules/auth/org/stdorgan/stdorganadd.html',
									controller : 'moduleAddCtrl',
									size : 'lg',
									resolve : {
										parentModule : function() {
											if(stdorganid=='#'){
												stdorganid=escape(stdorganid); 
											}
											return httpService
													.get({
														url : authPath+'/rest/security/stdorgan/findOneById?id='
																+ stdorganid
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
					// 添加最外层机构事件
					$scope.addStdorgan = function() {
						var modalInstance = $modal
								.open({
									animation : true,
									backdrop : false,
									templateUrl : 'modules/org/stdorgan/stdorganadd.html',
									controller : 'addStdorganCtrl',
									size : 'lg',									
								});

						modalInstance.result.then(function() {
							$scope.reloadgrid();
						}, function() {
							$log.info('Modal dismissed at: ' + new Date());
						});
					}
					// 编辑机构事件
					$scope.editClick = function(id) {
						/*var moduleParent=moduleService.findOneById(pid);
						var module=moduleService.findOneById(rowId);*/
						var modalInstance = $modal.open({
							animation : true,
							backdrop : false,
							templateUrl : 'modules/auth/org/stdorgan/stdorganadd.html',
							controller : 'moduleEditCtrl',
							size : 'lg',
							resolve : {
								module : function() {
								//通过id查找	
								return $scope.instance.execute('find',id);
								
								}
							}
						});

						modalInstance.result
							.then(
								function() {
									$scope.reloadgrid();
								},
								function() {
									$log.info('Modal dismissed at: '
											+ new Date());
								});
					};
					//delete机构事件
					
					$scope.deleteClick = function(id) {                               			
						
						if(confirm("确定删除此机构吗？")){
						$http.post(authPath+"/rest/security/stdorgan/delete/"+id,null).success(
								
								function(data) {            										
									
									$scope.reloadgrid();
									
									}).error(
								function() {
									toaster.pop('error', '失败信息',
											'机构删除失败，请重试！');
								});}
					};
					
					

				});
// 添加机构Ctrl
var moduleAddCtrl = stdorganNgModule.controller('moduleAddCtrl', [
		'$scope', '$modalInstance', 'parentModule', 'moduleService',
		function($scope, $modalInstance, parentModule, moduleService) {
			$scope.title = '添加子机构';
			$scope.parentNameShow=true;
			if(parentModule==""){
				$scope.module = {
						parentName : "无上级机构"

					};	
			}else{
				$scope.module = {
						parentName : parentModule.name

					};
			}
			
			//机构类型
			$scope.types = [{id : null, name : '全部'},{id : 'com', name : '公司'},{id : 'org', name : '部门'}];
			//$scope.types=["com","org"];
			$scope.confirm = function(o) {
				// debugger;
				if (o == false) {
					return;
				}
				var fmodule = {
					id : '',
					status : '',
					parentstdorganid : parentModule.id,
					name : $scope.module.name,
					abbr : $scope.module.abbr,
					alias : $scope.module.alias,
					spell : $scope.module.spell,
					type : $scope.module.type,
					stdcode : $scope.module.stdcode,
					remark : $scope.module.remark,
					displaynum : $scope.module.displaynum
				};

				moduleService.save({
					stdorgan : fmodule,
					total : 1
				}, function() {
					$modalInstance.close();
				});

			};

			$scope.cancel = function(organization) {
				$modalInstance.dismiss('cancel');
			};
		} ]);
//添加最外层机构Ctrl
var addStdorganCtrl = stdorganNgModule.controller('addStdorganCtrl', [
		'$scope', '$modalInstance',  'moduleService',
		function($scope, $modalInstance,  moduleService) {
			$scope.title = '添加菜单';	
			//机构类型
			$scope.types = [{id : null, name : '全部'},{id : 'com', name : '公司'},{id : 'org', name : '部门'}];
			$scope.confirm = function(o) {
				// debugger;
				if (o == false) {
					return;
				}
				var fmodule = {
					id : '',
					status : '',
					parentstdorganid : '',
					name : $scope.module.name,
					abbr : $scope.module.abbr,
					alias : $scope.module.alias,
					spell : $scope.module.spell,
					type : $scope.module.type,
					stdcode : $scope.module.stdcode,
					remark : $scope.module.remark,
					displaynum : $scope.module.displaynum
				};

				moduleService.save({
					stdorgan : fmodule,
					total : 1
				}, function() {
					$modalInstance.close();
				});

			};

			$scope.cancel = function(organization) {
				$modalInstance.dismiss('cancel');
			};
		} ]);
// 编辑机构Ctrl
var moduleEditCtrl = stdorganNgModule.controller('moduleEditCtrl', [ '$scope', '$modalInstance', 'module',
                           		'moduleService',
                           		function($scope, $modalInstance, module, moduleService) {
                           			$scope.title = '编辑菜单';
                           			$scope.parentNameShow=false;
                           		    //机构类型
                           			$scope.types = [{id : null, name : '全部'},{id : 'com', name : '公司'},{id : 'org', name : '部门'}];
                           			$scope.initType={type:module.type};
                           			$scope.module = {          				
                           				id :module.id,
                    					status : module.status,
                    					parentstdorganid : module.parentstdorganid,
                    					name : module.name,
                    					abbr : module.abbr,
                    					alias : module.alias,
                    					spell : module.spell,
                    					type :$scope.initType.type,
                    					stdcode : module.stdcode,
                    					remark : module.remark,
                    					displaynum : module.displaynum
                           			};
                           			//$scope.module = angular.copy(module);
                           			
                           			$scope.confirm = function(o) {
                        				// debugger;
                        				if (o == false) {
                        					return;
                        				}
                        				moduleService.save({
                        					stdorgan : $scope.module,
                        					total : 1
                        				}, function() {
                        					$modalInstance.close();
                        				});

                        			};
                           			

                           			$scope.cancel = function() {
                           				$modalInstance.dismiss('cancel');
                           			};
                           		} ]);
