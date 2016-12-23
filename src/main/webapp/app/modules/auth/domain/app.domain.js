var domainNgModule = angular.module('business.appdomain', [ 'ngResource',
		'ngCookies' ]);

var domainNgService = domainNgModule
		.factory(
				'domainNgService',
				[
						'$resource',
						function($resource) {
							var path = authPath+'/rest/:moduleName/:serviceName/:methodName?rnd=:random';
							var resource = $resource(path, {}, {
								get : {
									method : 'GET',
									params : {
										moduleName : 'business',
										serviceName : 'appdomain',
										methodName : 'getByEZAppDomainQuery',
										random : Math.random()
									}
								},
								saveDomain : {
									method : 'POST',
									params : {
										moduleName : 'business',
										serviceName : 'appdomain',
										methodName : 'save',
										/*
										 * plan : '@plan', total : '@total',
										 */
										random : Math.random()
									}
								},
								enable : {
									method : 'GET',
									params : {
										moduleName : 'business',
										serviceName : 'appdomain',
										methodName : 'enable',
										id : '@id',
										random : Math.random()
									}
								},
								disable : {
									method : 'GET',
									params : {
										moduleName : 'business',
										serviceName : 'appdomain',
										methodName : 'disable',
										domainId : '@domainId',
										random : Math.random()
									}
								},
							})

							return resource;
						} ]);

var domainNgCtrl = domainNgModule
		.controller(
				'domainNgCtrl',
				function($scope, $stateParams, $http, $uibModal, $q, $state,
						$rootScope, $window, $cookieStore, $log,
						domainNgService) {

					// 初始化查询条件

					$scope.cookieUrl = $cookieStore.get("domainList");
					$scope.initQueryObj = {};
					console.log($scope.cookieUrl);
					if ($scope.cookieUrl) {
						var arr = $scope.cookieUrl.split('&');
						for (var i = 0; i < arr.length; i++) {
							var son_arr = arr[i].split('=');
							$scope.initQueryObj[son_arr[0]] = son_arr[1];
						}
					}

					$scope.queryDto = {
						status : $scope.initQueryObj
								&& $scope.initQueryObj.status,
						name : $scope.initQueryObj && $scope.initQueryObj.name,
						page : $scope.initQueryObj && $scope.initQueryObj.page
								&& Number($scope.initQueryObj.page),
						rows : $scope.initQueryObj && $scope.initQueryObj.rows
								&& Number($scope.initQueryObj.rows)
					};
					// 定义刷新表格的方法
					$scope.reloadgrid = function() {
						$scope.instance.execute('reload');
					};
					// 获得翻页参数
					$scope.getPageParams = function() {
						if ($scope.page) {
							$scope.Parameters = 'page=' + $scope.page;
						} else {
							$scope.Parameters = 'page=1';
						}
						if ($scope.rows) {
							$scope.Parameters += '&rows=' + $scope.rows;
						} else {
							$scope.Parameters += '&rows=10';
						}
						if ($scope.name) {
							$scope.Parameters += '&name=' + $scope.name;
						}
						$cookieStore.put('domainList', $scope.Parameters);
					};

					// 添加
					$scope.addClick = function() {
						var modalInstance = $uibModal
						.open({
							animation : true,
							backdrop : false,
							templateUrl : 'modules/auth/domain/app.domain.add.html',
							controller : 'etitorCtrl',
							size : 'lg',
							resolve : {
								domain : function() {
									return null;
							}}
						});
						
						modalInstance.result.then(function() {
							$scope.reloadgrid();
						}, function() {
							$log.info('Modal dismissed at: ' + new Date());
						});
					}

					// 编辑
					$scope.editor = function(index) {
						var modalInstance = $uibModal
								.open({
									animation : true,
									backdrop : false,
									templateUrl : 'modules/auth/domain/app.domain.add.html',
									controller : 'etitorCtrl',
									size : 'lg',
									resolve : {
										domain : function() {
											return $scope.instance
													.execute('getData').rows[index];

										}

									}
								});

						modalInstance.result.then(function() {
							$scope.reloadgrid();
						}, function() {
							$log.info('Modal dismissed at: ' + new Date());
						});
					}

					$scope.options = {
						url : authPath+"/rest/business/appdomain/getByEZDomainQuery",// 加载的URL
						// idField : "ID",
						pagination : true,// 显示分页
						pageSize : $scope.queryDto.rows || pageSize,// 分页大小
						pageList : [ 5, 10, 15, 20 ],// 每页的个数
						pageNumber : $scope.queryDto.page || 1,
						queryParams : {
							filter : JSON.stringify([ {
								name : 'deleteFlag',
								operator : 'Equal',
								value : '0'
							} ])
						},
						fit : true,// 自动补全
						fitColumns : true,
						rownumbers : true,
						border : true,
						sortName : 'createTime',
						sortOrder : 'Desc',
						toolbar : "#GrapTextGroupListTb",
						scrollbarSize : 0,
						singleSelect : true,
						fitColumns: false,
						maxHeight : 308,
						columns : [ [// 每个列具体内容
								{
									field : 'applicationId',
									title : '应用Id',
									width : 150
								},
								{
									field : 'name',
									title : '应用名称',
									width : 100,
								},

								{
									field : 'abbr',
									title : '简称',
									width : 100
								},
								{
									field : 'alias',
									title : '别名',
									width : 100
								},
								{
									field : 'applicationCode',
									title : '编码',
									width : 100
								},

								{
									field : 'status',
									title : '是否启用',
									width : 150,
									align : 'center',
									formatter : function(value, row, index) {
										return value == 1 ? "已启用"
												: value == 0 ? "未启用" : "未知";
									}
								},
								{
									field : 'applicationKey',
									title : '公钥\私钥',
									width : 150,
									align : 'center',
									
								},
								{
									field : 'createTime',
									title : '创建时间',
									width : 150,
									align : 'center',
									resizable : false,
									sortable : true,
									formatter : function(value, row, index) {
										return moment(row.createTime).format(
												"YYYY-MM-DD HH:mm:ss");
									}
								},
								{
									field : 'applicatonId',
									title : '操作',
									width : 150,
									resizable : false,
									sortable : true,
									formatter : function(value, row, index) {
										var str = '';
										str = str
												+ '<button  type="button" class="btn btn-primary btn-xs"'
												+ 'ng-click="editor(\'' + index
												+ '\')">编　辑</button>&nbsp;&nbsp;';

										if (row.status == 0) {
											str = str
													+ '<button  type="button" class="btn btn-info btn-xs"'
													+ 'ng-click="enableClick(\''
													+ row.applicationId
													+ '\')">启用</button>&nbsp;&nbsp;';
										}
										;
										if (row.status == 1) {
											str = str
													+ '<button  type="button" data-toggle="confirmation" data-original-title="Are you sure ?" class="btn btn-danger btn-xs"'
													+ 'ng-click="disableClick(\''
													+ row.applicationId
													+ '\')">禁用</button>&nbsp;&nbsp;';
										}
										;
										str = str
												+ '<button  type="button" class="btn btn-danger btn-xs"'
												+ 'ng-click="goDelete(\''
												+ row.applicationId
												+ '\' )">删	除</button>&nbsp;&nbsp;';
										return str;

									}
								}


						] ],
						onSelectPage : function(pageNumber, pageSize) {
							$scope.page = pageNumber;
							$scope.rows = pageSize;
							$scope.getPageParams();
							$scope.instance.execute('options').pageSize = pageSize;
							$scope.instance.execute('options').pageNumber = pageNumber;
							$scope.instance.execute('reload');
							// $state.go('app.grapTextGroups.manageList',{Parameters:$scope.Parameters});
						},
						onChangePageSize : function(pageSize) {
							$scope.rows = pageSize;
							$scope.getPageParams();
							$scope.instance.execute('options').pageSize = pageSize;
							$scope.instance.execute('reload');
							// $state.go('app.grapTextGroups.manageList',{Parameters:$scope.Parameters});
						}
					};
					$scope.instance = null;
					$scope.init = function() {
						return function(instance) {
							$scope.instance = instance;
						};
					};
					// 启用
					$scope.enableClick = function(domainId) {
						domainNgService.enable({
							domainId : domainId
						}, function() {
							$scope.reloadgrid();
						});
					};
					// 禁用
					$scope.disableClick = function(domainId) {
						domainNgService.disable({
							domainId : domainId
						}, function() {
							$scope.reloadgrid();
						});
					};
					// 删除
					$scope.goDelete = function(applicationId) {

						if (confirm("确定删除此业务域？")) {
							$http.post(
									authPath+"/rest/business/appdomain/delete/"
											+ applicationId, null).success(
									function(data) {
										$scope.instance.execute('reload');
									}).error(function() {
								alert("删除失败！");
							});
						}
					};
					$scope.instance = null;
					$scope.init = function() {
						return function(instance) {
							$scope.instance = instance;
						};
					};
					// 查询按钮
					$scope.query = function() {
						$scope.page = 1;
						$scope.getPageParams();
						$scope.cookieUrl = $cookieStore.get("domainList");
						$scope.initQueryObj = {};
						console.log($scope.cookieUrl);
						if ($scope.cookieUrl) {
							var arr = $scope.cookieUrl.split('&');
							for (var i = 0; i < arr.length; i++) {
								var son_arr = arr[i].split('=');
								$scope.initQueryObj[son_arr[0]] = son_arr[1];
							}
						}

						$scope.instance.execute('load', {
							filter : JSON.stringify([ {
								name : 'deleteFlag',
								operator : 'Equal',
								value : 0
							}, {
								name : 'name',
								operator : 'Like',
								value : $scope.domain.name
							} ])
						});
					};
					// 清空按钮
					$scope.doClear = function() {
						$scope.Parameters = 'page=1';
						if ($scope.rows) {
							$scope.Parameters += '&rows=' + $scope.rows;
						} else {
							$scope.Parameters += '&rows=10';
						}
						$cookieStore.put('domainList', $scope.Parameters);

						$scope.domain.name = "";

						$scope.cookieUrl = $cookieStore.get("domainList");
						$scope.initQueryObj = {};
						console.log($scope.cookieUrl);
						if ($scope.cookieUrl) {
							var arr = $scope.cookieUrl.split('&');
							for (var i = 0; i < arr.length; i++) {
								var son_arr = arr[i].split('=');
								$scope.initQueryObj[son_arr[0]] = son_arr[1];
							}
						}
						$scope.instance.execute('options').pageNumber = $scope.initQueryObj
								&& $scope.initQueryObj.page
								&& Number($scope.initQueryObj.page);
						$scope.instance.execute('options').pageSize = $scope.initQueryObj
								&& $scope.initQueryObj.rows
								&& Number($scope.initQueryObj.rows);
						$scope.instance.execute('load', {
							filter : JSON.stringify([ {
								name : 'deleteFlag',
								operator : 'Equal',
								value : 0
							}, {
								name : 'name',
								operator : 'Like',
								value : $scope.domain.name
							} ])
						});
					};

					// set sidebar closed and body solid layout mode
					$rootScope.settings.layout.pageContentWhite = true;
					$rootScope.settings.layout.pageBodySolid = false;
					$rootScope.settings.layout.pageSidebarClosed = false;

				});



var etitorCtrl = domainNgModule.controller('etitorCtrl', function($scope, $uibModalInstance, domainNgService, domain) {
			// var data = $scope.instance.execute('getData').rows[index];
	
			$scope.title = '添加业务应用';
			// $scope.domain.status=0;
			if(domain!=null){
				$scope.title = '编辑应用';
				// $scope.domainStatus=$scope.domainStatus
			}
			$scope.gStatuses = [ {
				status : '已启用',
				name : 0
			}, {
				status : '未启用',
				name : 1
			} ];
			//$scope.domain.status=0;
			$scope.instance = null;
			$scope.init = function() {
				return function(instance) {
					$scope.instance = instance;
				};
			};

			$scope.domain = domain;// 获取的值付给前台
			
			$scope.ok = function(o, domain) {
				// debugger;
				if (o == false)
					return;
				
				if($scope.domain!=null){
					var p={
							applicationId :$scope.domain.applicationId== undefined? "":$scope.domain.applicationId,
							name :$scope.domain.name==undefined? "": $scope.domain.name,
							abbr : $scope.domain.abbr==undefined? "":$scope.domain.abbr,
							alias : $scope.domain.alias==undefined? "":$scope.domain.alias,
							applicationCode : $scope.domain.applicationCode==undefined? "":$scope.domain.applicationCode,
							applicationUri : $scope.domain.applicationUri==undefined? "":$scope.domain.applicationUri,
							applicationKey : $scope.domain.applicationKey==undefined? "":$scope.domain.applicationKey,
							applicationSecret : $scope.domain.applicationSecret==undefined? "":$scope.domain.applicationSecret,
							remakr : $scope.domain.remakr==undefined? "":$scope.domain.remakr,
							//status : $scope.domain.status==undefined? "":$scope.domain.status,
							status : 0,
							deleteFlag : 0
							
					}
				}
				
				domainNgService.saveDomain(p, function() {
					$uibModalInstance.close();// 保存成功后，返回列表页
				});// TODO 标记

			};

			$scope.cancel = function(organization) {
				$uibModalInstance.dismiss('cancel');
			};
		} );