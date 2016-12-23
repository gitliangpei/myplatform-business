var prooRganNgModule = angular.module('business.proogran', [ 'ngResource',
		'ngCookies','MetronicApp' ]);

var prooRganNgService = prooRganNgModule
		.factory(
				'prooRganNgService',
				[
						'$resource',
						function($resource) {
							var path = authPath+'/rest/:moduleName/:serviceName/:methodName?rnd=:random';
							var resource = $resource(path, {}, {
								// 得到业务域
								getDomain : {
									method : 'GET',
									params : {
										moduleName : 'business',
										serviceName : 'domain',
										methodName : 'getByEZPageDomainQuery',
										random : Math.random()
									}
								},
								// 保存业务机构
								saveProorgan : {
									method : 'POST',
									params : {
										moduleName : 'business',
										serviceName : 'proorgan',
										methodName : 'save',
										random : Math.random()
									}
								},
								// 得到业务机构
								getProorganBydomainId : {
									method : 'GET',
									params : {
										moduleName : 'business',
										serviceName : 'proorgan',
										methodName : 'getProorgan',
										domainId : '@domainId',
										random : Math.random()
									},
									isArray : true
								},
								// 通过业务机构Id得到该业务就够下得人员与人员对应的职责
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
								// 通过stdorganId得到人员
								getEmployee : {
									method : 'GET',
									params : {
										moduleName : 'business',
										serviceName : 'employee',
										methodName : 'getEmployee',
										stdorganId : '@stdorganId',
										random : Math.random()
									}
								},
								// 保存人员对对应的业务机构
								saveRproorganEmployee : {
									method : 'POST',
									params : {
										moduleName : 'business',
										serviceName : 'rproorganemployee',
										methodName : 'saveRproorganEmployee',
										random : Math.random()
									}
								},
								// 保存职责到对应的人
								saveRemployeeDuty : {
									method : 'POST',
									params : {
										moduleName : 'business',
										serviceName : 'remployeeduty',
										methodName : 'saveDuty',
										random : Math.random()
									}
								},
								// fhq js

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

							})

							return resource;
						} ]);

var prooRganNgCtrl = prooRganNgModule
		.controller(
				'prooRganNgCtrl',
				function($scope, $stateParams, $http, $uibModal, $q, $state,
						$rootScope, $window, $cookieStore, $log, $filter,
						prooRganNgService,httpService,toaster) {

					$scope.getprooRgan = function() {
						prooRganNgService.getDomain(function(data) {
							$scope.domain = data.rows;
							p = data.rows[0].domainId;
							$scope.initTree(p);
						}, function(msg) {
							
							$scope.totalPage = 0;
						});
					};
					$scope.refreshData = function(d) {
						p = d.domainId;
						$scope.initTree(p);
					};
					
					//依据业务机构，查询所属人员（局部刷新用）
					var refreshUser = function (proorganId){
						
						prooRganNgService.getStdDescendant(
								{
									proorganId : proorganId
								},
								function(data) {
									$scope.dtos = data;
									$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {  
										 $('.editable-select').editable({																	        
										        source: authPath+"/rest/auth/duty/findDuty",
										         url: function(params) {
										        	    var d = new $.Deferred();
										        	        var pk = params.pk;
										        	        var paraAry = pk.toString().split("-");
										        	    	var p = {
																	id : paraAry[0],
																	employeeId : paraAry[1],
																	proorganId : $scope.proorganId,
																	dutyId : params.value
															};
															prooRganNgService.saveRemployeeDuty(p);
															d.resolve();
										        	        return d.promise();
										        }
										   });
									});															
									
								});
						
					}

					$scope.initTree = function(p) {
						$('#orgTreeView').data('jstree', false).empty();// 如果不清空实例，jstree不会重新生成
						$('#orgTreeView')
								.jstree(
										{
											'plugins' : [ 'changed',
													'wholerow', 'contextmenu' ],
											// 'plugins' : [ 'checkbox',
											// 'contextmenu', 'dnd',
											// 'massload', 'search',
											// 'sort', 'state', 'types',
											// 'unique', 'wholerow',
											// 'changed',
											// 'conditionalselect' ],
											'core' : {
												'themes' : {
													'responsive' : false
												},
												'data' : {
													'url' : function(p_node) {
														// 得到业务机构
														return authPath+'/rest/business/proorgan/getProorgan';
													},
													'data' : function(p_node) {
														var param = {
															'parentProorganId' : p_node.id,
															'domainId' : p
														};
														return param;
													},
													'dataFilter' : function(
															p_response) {
														p_response = JSON
																.parse(p_response);

														var children = [];

														if (p_response !== null) {
															// 记录原始数据
															$scope
																	.updateStdOrganData(p_response);
															// 构建树节点数据
															$
																	.each(
																			p_response,
																			function(
																					p_index,
																					p_item) {
																				children
																						.push({
																							'id' : p_item['id'],// 主键Id
																							'text' : p_item['name'],
																							'type' : p_item['type'],
																							'children' : true
																						});
																			});
														}

														return JSON
																.stringify(children);
													}
												},
												'strings' : {
													'Loading ...' : '正在加载...'
												},
											},
											'contextmenu' : {
												'items' : {
													'create' : null,
													'rename' : null,
													'remove' : null,
													'ccp' : null,
													'新建' : {
														'label' : '新建机构',
														'action' : function(
																data) {
															var inst = jQuery.jstree
																	.reference(data.reference), obj = inst
																	.get_node(data.reference);
															var modalInstance = $uibModal
																	.open({
																		animation : true,
																		backdrop : false,
																		templateUrl : 'modules/auth/proorgan/proorgan.children.add.html',
																		controller : 'addEmployeeChildrenCtrl',
																		size : 'lg',
																		resolve : {// 得到参数传到addEmployeeChildrenCtrl，在addEmployeeChildrenCtrl先注入一下
																			proorgan : function() {
																				return null;
																			},
																			parentProorganId : function() {
																				return obj.id;
																			},
																			domainId : function() {
																				return p;
																			}
																		}
																	});
															
															//回调
															modalInstance.result.then(function(proorgan) {// TODO
																//新增机构
																var ref = $('#orgTreeView').jstree(true),sel = ref.get_selected();
																if(!sel.length) { return false; }
																sel = sel[0];
																ref.create_node(sel, {"id":proorgan.id,"text":proorgan.name,"children":true});
																
															}, function(reason) {
																console.log(reason);
																$log.info('Modal dismissed at: ' + new Date());
															});
														}
													},
													'编辑' : {
														'label' : '编辑菜单',
														'action' : function(
																data) {
															var inst = jQuery.jstree
																	.reference(data.reference), obj = inst
																	.get_node(data.reference);
															var modalInstance = $uibModal
																	.open({
																		animation : true,
																		backdrop : false,
																		templateUrl : 'modules/auth/proorgan/proorgan.children.add.html',
																		controller : 'addEmployeeChildrenCtrl',
																		size : 'lg',
																		resolve : {// 得到参数传到addEmployeeChildrenCtrl，在addEmployeeChildrenCtrl先注入一下
																			proorgan : function() {
																				//var nodes=$("#orgTreeView").jstree("selected");
																				return httpService.get({
																					url : authPath+"/rest/business/proorgan/getProorganByProorganId/"+obj.id
																				}
																				);
																						
																			},
																			parentProorganId : function() {
																				return obj.id;
																			},
																			domainId : function() {
																				return p;
																			}
																		}
																	});
															
															//回调
															modalInstance.result.then(function(proorgan) {// TODO
																//编辑机构
																var ref = $('#orgTreeView').jstree(true),sel = ref.get_selected();
																sel = ref.get_selected();
																if(!sel.length) { return false; }
																sel = sel[0];
																ref.rename_node(sel, proorgan.name);
																
															}, function(reason) {
																console.log(reason);
																$log.info('Modal dismissed at: ' + new Date());
															});
															
														}
													},
													'删除' : {
														'label' : '删除菜单',
														'action' : function(
																data) {
															var inst = jQuery.jstree
																	.reference(data.reference), obj = inst
																	.get_node(data.reference);
															if (obj.children.length != 0) {
																toaster.pop('error', '操作失败', '该节点下有子节点，不能删除！');
															} else if (confirm("确定要删除此菜单？删除后不可恢复。")) {
																$http
																		.post(
																				authPath+"/rest/business/proorgan/delete/"
																						+ obj.id,
																				null)
																		.success(
																				function(
																						data) {
																					//删除机构
																					var ref = $('#orgTreeView').jstree(true),sel = ref.get_selected();
																					sel = ref.get_selected();
																					if(!sel.length) { return false; }
																					ref.delete_node(sel);
																				})
																		.error(
																				function() {																					
																					toaster.pop('error', '操作失败', '删除机构失败失败！');
																				});
															}
														}
													}
												}
											},
											'types' : {
												'com' : {
													'icon' : 'fa fa-folder icon-state-warning icon-lg'
												},
												'default' : {
													'icon' : 'fa fa-institution icon-state-info icon-lg'
												},
												'org' : {
													'icon' : 'fa fa-info-circle icon-state-info icon-lg'
												}
											}
										}).on('loaded.jstree', function(e, data){  
										    var inst = data.instance;  
										    var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);//默认选中第一项
										      
										    inst.select_node(obj);
										}); 

						
						
						$('#orgTreeView')
								.on('select_node.jstree',
										function(p_event, p_selected) {
											
											$scope.proorganId = p_selected.node.id;// TODO
											refreshUser($scope.proorganId);
											
										});
					};

					$scope.updateStdOrganData = function(p_data) {
					};

					$scope.init = function() {// 初始化数据
						$scope.getprooRgan();

					};

					$rootScope.settings.layout.pageContentWhite = true;
					$rootScope.settings.layout.pageBodySolid = false;
					$rootScope.settings.layout.pageSidebarClosed = false;

					$scope.init();
					// 添加
					$scope.addProorgan = function() {
						var modalInstance = $uibModal.open({
							animation : true,
							backdrop : false,
							templateUrl : 'modules/auth/proorgan/proorgan.add.html',
							controller : 'addProorganCtrl',
							size : 'lg',
							resolve : {// 得到参数传到addEmployeeChildrenCtrl，在addEmployeeChildrenCtrl先注入一下
								domainId : function() {
									return p;
								}
							}
						});

						modalInstance.result.then(function() {
							// $scope.proorganId();
						}, function() {
							$log.info('Modal dismissed at: ' + new Date());
						});
					}
					$scope.reloadgrid = function() {
						$scope.instance.execute('reload');
					};
					$scope.addEmployee = function() {
						
						var modalInstance = $uibModal
								.open({
									animation : true,
									backdrop : false,
									templateUrl : 'partials/employee/stdorganEmployee.html',
									controller : 'stdorganEmployeeNgCtrl',
									size : 'lg',
									resolve : {
										proorganId : function() {
											return $scope.proorganId;
										},
										employee : function() {
											return null;
										},
										dtos : function() {
											return $scope.dtos;
										}
									}
								});

						modalInstance.result.then(function(p) {// TODO
							//回调刷新用户列表
							refreshUser(p.proorganId);
						}, function(reason) {
							console.log(reason);
							$log.info('Modal dismissed at: ' + new Date());
						})
					};
					// 删除机构里的人员
					$scope.deleteEmployee = function(employee) {
						if (confirm("确定删除该人员？")) {
							var ids = employee.id + "," + $scope.proorganId;
							$http.post(
									authPath+"/rest/business/rproorganemployee/deleteEmployeeById/"
											+ ids, null).success(
									function(data) {
										//回调刷新用户列表
										refreshUser($scope.proorganId);
									}).error(function() {
										toaster.pop('error', '操作失败', '删除失败！');
							});
						}
					};
					$scope.bjEmployee = function() {

					}
				});

var addCProorgantrl = prooRganNgModule.controller('addProorganCtrl', function(
		$scope, $uibModalInstance, prooRganNgService, domainId) {

	$scope.title = '添加业务机构';
	$scope.ok = function(o) {
		// debugger;
		if (o == false)
			return;
		if ($scope.proorgan != null) {
			var p = {
				proorganId : $scope.proorgan.proorganId == undefined ? ""
						: $scope.proorgan.proorganId,
				// parentProorganId : $scope.proorgan.parentProorganId ==
				// undefined ? ""
				// : $scope.proorgan.parentProorganId,
				parentProorganId : "#",
				domainId : domainId,
				stdorganId : $scope.proorgan.stdorganId == undefined ? ""
						: $scope.proorgan.stdorganId,
				name : $scope.proorgan.name == undefined ? ""
						: $scope.proorgan.name,
				abbr : $scope.proorgan.abbr == undefined ? ""
						: $scope.proorgan.abbr,
				procode : $scope.proorgan.procode == undefined ? ""
						: $scope.proorgan.procode,
				remark : $scope.proorgan.remark == undefined ? ""
						: $scope.proorgan.remark,
				displayNum : $scope.proorgan.displayNum == undefined ? ""
						: $scope.proorgan.displayNum,
				status : $scope.proorgan.status == undefined ? ""
						: $scope.proorgan.status,
				deleteFlag : 0
			}
		}
		prooRganNgService.saveProorgan(p, function() {
			location.reload();// 保存后刷新页面
		});// TODO 标记
	};

	$scope.cancel = function(organization) {
		$uibModalInstance.dismiss('cancel');
	};

});

// Employee Ctrl
// var addEmployeeCtrl = prooRganNgModule.controller('addEmployeeCtrl',
// function(
// $scope, $uibModalInstance, prooRganNgService) {
// $scope.title = '添加人员';
//
// $scope.cancel = function(organization) {
// $uibModalInstance.dismiss('cancel');
// };
// })
var addEmployeeChildrenCtrl = prooRganNgModule
		.controller(
				'addEmployeeChildrenCtrl',
				function($scope, $uibModalInstance, prooRganNgService,
						proorgan, parentProorganId, domainId) {
					$scope.title = '新建页面';
					if (proorgan != null) {
						$scope.title = '编辑页面';
					}
					$scope.proorgan = proorgan;
					$scope.ok = function(o) {
						// debugger;
						if (o == false)
							return;
						if ($scope.proorgan != null) {
							var p = {
									id : $scope.proorgan.id == undefined ? ""
											: $scope.proorgan.id,
									parentProorganId : parentProorganId,
									domainId : domainId,
									stdorganId : $scope.proorgan.stdorganId == undefined ? ""
											: $scope.proorgan.stdorganId,
									name : $scope.proorgan.name == undefined ? ""
											: $scope.proorgan.name,
									abbr : $scope.proorgan.abbr == undefined ? ""
											: $scope.proorgan.abbr,
									procode : $scope.proorgan.procode == undefined ? ""
											: $scope.proorgan.procode,
									remark : $scope.proorgan.remark == undefined ? ""
											: $scope.proorgan.remark,
									displayNum : $scope.proorgan.displayNum == undefined ? ""
											: $scope.proorgan.displayNum,
									status : $scope.proorgan.status == undefined ? ""
											: $scope.proorgan.status,
									deleteFlag : 0
								}
						}

						prooRganNgService.saveProorgan(p, function(proorgan) {
							// 保存成功后，返回列表页
							$uibModalInstance.close(proorgan);
						});// TODO 标记

					};
					$scope.cancel = function(organization) {
						$uibModalInstance.dismiss('cancel');
					};
				})

var httpService = prooRganNgModule.factory('httpService', [ '$http', '$q',
		function($http, $q, webpath) {

			var service = {};

			service.get = function(options) {

				var deferred = $q.defer();
				var accessUrl = options.url;

				$http.get(accessUrl).success(function(data) {
					deferred.resolve(data);
				}).error(function(msg) {

				});
				return deferred.promise;
			};

			service.post = function(options) {
				var deferred = $q.defer();
				var accessUrl = options.url;

				$http.post(accessUrl, options.data).success(function(data) {
					if (!(options.showSuccessMsg === false)) {
					}

					deferred.resolve(data);
				}).error(function(msg) {

				});
				return deferred.promise;
			};

			return service;
		} ]);
// 机构对应人员Ctrl
var stdorganEmployeeNgCtrl = prooRganNgModule
		.controller(
				'stdorganEmployeeNgCtrl',
				function($scope, $stateParams, $http, $uibModal,
						$uibModalInstance, $state, $rootScope, $window,
						$cookieStore, $log, prooRganNgService, httpService,
						proorganId, dtos) {
					// jstree机构树
					$scope.dataStdOrgan = [];
					$scope.currentStdOrgan = null;
					$scope.stdorganId;
					$scope.title = "基准机构人员列表"
					$scope
							.$watch(
									'$viewContentLoaded',
									function() {// 监听

										$scope.initTree = function() {
											$('#addTreeview')
													.jstree(
															{
																'core' : {
																	'themes' : {
																		'responsive' : false
																	},
																	'data' : {
																		'url' : function(
																				p_node) {
																			return authPath+'/rest/security/stdorgan/getChildrenByParentId';
																		},
																		'data' : function(
																				p_node) {
																			var param = {
																				'id' : p_node.id
																			};
																			if (p_node.id === '#') {
																				param.parent = null;
																			}
																			return param;
																		},
																		'dataFilter' : function(
																				p_response) {
																			p_response = JSON
																					.parse(p_response);

																			var children = [];

																			if (p_response !== null) {
																				// 记录原始数据
																				$scope
																						.updateStdOrganData(p_response);
																				// 构建树节点数据
																				$
																						.each(
																								p_response,
																								function(
																										p_index,
																										p_item) {
																									children
																											.push({
																												'id' : p_item['id'],
																												'text' : p_item['name'],
																												'type' : p_item['type'],
																												'children' : true
																											});
																								});
																			}

																			return JSON
																					.stringify(children);
																		}
																	},
																	'strings' : {
																		'Loading ...' : '正在加载...'
																	},
																},
																'types' : {
																	'default' : {
																		'icon' : 'fa fa-folder icon-state-warning icon-lg'
																	},
																	'com' : {
																		'icon' : 'fa fa-institution icon-state-info icon-lg'
																	},
																	'org' : {
																		'icon' : 'fa fa-info-circle icon-state-info icon-lg'
																	}
																}
															});

											$('#addTreeview')
													.on(
															'select_node.jstree',
															function(p_event,
																	p_selected) {

																$scope.stdorganId = p_selected.node.id;

																// 获取后代子机构
																prooRganNgService
																		.getStdDescendants(
																				{
																					stdorganId : $scope.stdorganId
																				},
																				function(
																						data) {
																					var Objstdorgan = data;
																					var stdorgans = ''
																					for (var i = 0; i < Objstdorgan.length; i++) {
																						stdorgans += Objstdorgan[i].id
																								+ ',';
																					}
																					if (stdorgans.length > 0) {
																						stdorgans = stdorgans
																								.substr(
																										0,
																										stdorgans.length - 1);
																						// 重新载入查询条件
																						$scope.instance
																								.execute(
																										'load',
																										{
																											filter : JSON
																													.stringify([
																															{
																																name : 'deleteFlag',
																																operator : 'Equal',
																																value : 0
																															},
																															{
																																name : 'stdorganId',
																																operator : 'In',
																																value : stdorgans
																															} ])
																										});
																					}

																				},
																				function(
																						msg) {
																					// alert(msg);
																				});

															});

											$('#addTreeview').on(
													'select_node.jstree',
													function() {
														// TODO
													});

										};

										$scope.updateStdOrganData = function(
												p_data) {

										};

										$scope.init = function() {
											$scope.initTree();
										};

										// set sidebar closed and body solid
										// layout mode
										$rootScope.settings.layout.pageContentWhite = true;
										$rootScope.settings.layout.pageBodySolid = false;
										$rootScope.settings.layout.pageSidebarClosed = false;

										$scope.init();

									})
					// jstree结束

					// 员工datagrid开始
					// 初始化查询条件
					// $scope.cookieUrl = $cookieStore.get("realList");
					// $scope.initQueryObj = {};
					// // console.log($scope.cookieUrl);
					// if ($scope.cookieUrl) {
					// var arr = $scope.cookieUrl.split('&');
					// for (var i = 0; i < arr.length; i++) {
					// var son_arr = arr[i].split('=');
					// $scope.initQueryObj[son_arr[0]] = son_arr[1];
					// }
					// }
					// // console.log($scope.initQueryObj);
					$scope.queryDto = {
						minYearCost : $scope.initQueryObj
								&& $scope.initQueryObj.minYearCost,
						maxYearCost : $scope.initQueryObj
								&& $scope.initQueryObj.maxYearCost,
						buildYear : $scope.initQueryObj
								&& $scope.initQueryObj.buildYear,
						page : $scope.initQueryObj && $scope.initQueryObj.page
								&& Number($scope.initQueryObj.page),
						rows : $scope.initQueryObj && $scope.initQueryObj.rows
								&& Number($scope.initQueryObj.rows)
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
						if ($scope.minYearCost) {
							$scope.Parameters += '&minYearCost='
									+ $scope.minYearCost;
						}
						if ($scope.maxYearCost) {
							$scope.Parameters += '&maxYearCost='
									+ $scope.maxYearCost;
						}
						if ($scope.buildYear) {
							$scope.Parameters += '&buildYear='
									+ $scope.buildYear;
						}
						$cookieStore.put('realList', $scope.Parameters);
					};

					var aaaaa = $scope.stdorganId;
					$scope.id = '';
					for (var i = 0; i < dtos.length; i++) {
						console.log(dtos[i].tEmployee.id);
						$scope.id += dtos[i].tEmployee.id + ',';
					}
					$scope.options = {
						url : authPath+"/rest/security/employee/getAll",// 加载的URL
						idField : "ID",
						pagination : true,// 显示分页
						pageSize : $scope.queryDto.rows || 10,// 分页大小
						pageList : [ 5, 10, 15, 20 ],// 每页的个数
						pageNumber : $scope.queryDto.page || 1,
						queryParams : {
							filter : JSON.stringify([ {// 过滤条件
								name : 'deleteFlag',
								operator : 'Equal',
								value : 0
							}, {
								name : 'stdorganId',
								operator : 'Equal',
								value : $scope.stdorganId
							}, {
								name : 'id',
								operator : 'NotIn',
								value : $scope.id
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
						maxHeight : 320,
						columns : [ [// 每个列具体内容
								{
									field : 'guId',
									title : '员工编码',
									align : 'center',
									width : 10
								},
								{
									field : 'realName',
									title : '真实姓名',
									align : 'center',
									width : 10
								},
								{
									field : 'identification',
									title : '身份证号',
									align : 'center',
									width : 10
								},
								{
									field : 'id',
									title : '操作',
									width : 10,
									align : 'center',
									formatter : function(value, row, index) {
										var str = '';
										str = str + '<input  type="checkbox"'
										// + 'ng-modle=""'
										+ 'ng-click="updateSelection($event,\''
												+ index + '\')"'
												+ 'ng-checked="isChecked(\''
												+ index + '\')">'
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
					};// options结束
					$(window).resize();// 改变窗口大小重新 加载页面
					$scope.instance = null;
					$scope.init = function() {
						return function(instance) {
							$scope.instance = instance;
						};
					};
					$scope.cancel = function(organization) {
						$uibModalInstance.dismiss('cancel');
					};
					$scope.instance = null;
					$scope.init = function() {
						return function(instance) {
							$scope.instance = instance;
						};
					};
					// $scope.reloadgrid = function() {
					// $scope.instance.execute('reload');
					// };
					// set sidebar closed and body solid layout mode
					$rootScope.settings.layout.pageContentWhite = true;
					$rootScope.settings.layout.pageBodySolid = false;
					$rootScope.settings.layout.pageSidebarClosed = false;
					// 员工datagrid结束

					// $scope.rps = resPermis;
					// $scope.rrpDto = {role : null, rolePermissionDtos : []}
					$scope.rrpDto = []
					// 更新复选框选项
					$scope.updateSelection = function($event, index) {
						var employee = $scope.instance.execute('getData').rows[index];// 用index得到这一行的数据
						var checkbox = $event.target;
						var checked = checkbox.checked;
						if (checked) {
							if(jQuery.inArray(employee, $scope.rrpDto)==-1){
								$scope.rrpDto.push(employee);//把选中的人员放到数组中
							}
							console.log($scope.rrpDto);// 打印到前台测试
						} else {
							// 移除数组中的对象元素，因为传来的对象地址和数组中的不同，所以即使两对象值完全相同，他们也不相等，所以不能直接移除对象
							var employee = $scope.instance.execute('getData').rows[index];
							var i = $scope.rrpDto.indexOf(employee);//
							$scope.rrpDto.splice(i, 1);// 复选框移除选中
							console.log($scope.rrpDto);// 打印到前台测试
						}
					};

					$scope.ok = function() {// TODO
						var p = {
							proorganId : proorganId,
							employees : $scope.rrpDto
						};
						prooRganNgService.saveRproorganEmployee(p, function() {
							// $uibModalInstance.close($scope.textid);//
							// 保存成功后，返回列表页
							$uibModalInstance.close(p);
						});
					};

				});// stdorganEmployeeNgCtrl结束
var stdorganTreeCtrl = prooRganNgModule.controller('stdorganTreeCtrl', [
		'$scope',
		'prooRganNgService',
		'httpService',
		function($scope, prooRganNgService, httpService) {

			prooRganNgService.getAllStds(function(data) {
				stdorgans = data;

				// 机构选择树
				for (var i = 0; i < stdorgans.length; i++) {
					var selected = false;
					/*
					 * for (var j = 0; j < selectedModules.length; j++) { if
					 * (selectedModules[j].resourceId == stdorgans[i].id) {
					 * selected = true; break; } }
					 */

					console.log("selected:" + selected);
					stdorgans[i].parent = stdorgans[i].parentstdorganid || '#';
					stdorgans[i].text = stdorgans[i].name;
					stdorgans[i].state = {
						opened : true,
						selected : selected
					};
				}
				$scope.treeData = stdorgans;
			}, function(msg) {
				// alert(msg);
			});

			// $scope.role = role;
			$scope.$watch('$viewContentLoaded', function() {
				$scope.treeConfig = {
					core : {
						multiple : false,
						animation : true,
						error : function(error) {
							$log.error('treeCtrl: error from js tree - '
									+ angular.toJson(error));
						},
						check_callback : true,
						worker : true
					},
					version : (new Date()).getTime(),
					plugins : [ 'types', 'checkbox' ]
				};
			});

			$scope.ok = function() {
				var selectedNodes = this.treeInstance.jstree(true)
						.get_selected();
				var permissions = [];
				for (var i = 0; i < selectedNodes.length; i++) {
					permissions.push({
						resourceId : selectedNodes[i]
					});
				}
				permissionService.distribute($scope.role.id, permissions).then(
						function() {
							$modalInstance.close();
						});
			}
			// 机构选择树结束

		} ])

var stdorganTreeTreeCtrl = prooRganNgModule
		.controller(
				'stdorganTreeTreeCtrl',
				[
						'$scope',
						'prooRganNgService',
						'httpService',
						'stdorgans',
						function($scope, prooRganNgService, httpService,
								stdorgans) {

							// 机构选择树
							for (var i = 0; i < stdorgans.length; i++) {
								var selected = false;
								console.log("selected:" + selected);
								stdorgans[i].parent = stdorgans[i].parentstdorganid
										|| '#';
								stdorgans[i].text = stdorgans[i].name;
								stdorgans[i].state = {
									opened : true,
									selected : selected
								};
							}
							$scope.treeData = stdorgans;

							// $scope.role = role;
							$scope
									.$watch(
											'$viewContentLoaded',
											function() {
												$scope.treeConfig = {
													core : {
														multiple : false,
														animation : true,
														error : function(error) {
															$log
																	.error('treeCtrl: error from js tree - '
																			+ angular
																					.toJson(error));
														},
														check_callback : true,
														worker : true
													},
													version : (new Date())
															.getTime(),
													plugins : [ 'types',
															'checkbox' ]
												};
											});

							$scope.ok = function() {
								var selectedNodes = this.treeInstance.jstree(
										true).get_selected();
								var permissions = [];
								for (var i = 0; i < selectedNodes.length; i++) {
									permissions.push({
										resourceId : selectedNodes[i]
									});
								}
								permissionService.distribute($scope.role.id,
										permissions).then(function() {
									$modalInstance.close();
								});
							}
							// 机构选择树结束

						} ])
