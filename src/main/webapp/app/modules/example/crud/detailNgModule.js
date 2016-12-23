var detailNgModule = angular.module('example.detail', [ 'ngResource' ]);

var detailNgService = detailNgModule
		.factory(
				'detailNgService',
				[
						'$resource',
						function($resource) {
							var path = '../rest/:moduleName/:serviceName/:methodName?rnd=:random';
							var resource = $resource(path, {}, {
								get : {
									method : 'GET',
									params : {
										moduleName : 'example',
										serviceName : 'crud',
										methodName : 'getById',
										id : '@id',
										random : Math.random()
									}
								},
								save : {
									method : 'POST',
									params : {
										moduleName : 'example',
										serviceName : 'crud',
										methodName : 'save',
										crud : '@crud',
										total : '@total',
										random : Math.random()
									}
								}
							});
							return resource;
						} ]);

var detailNgCtrl = detailNgModule.controller('detailNgCtrl', function(
		$rootScope, $scope, $http, $window, $stateParams, detailNgService) {
	//初始化下拉框
	$scope.groupTypes = [{id : "1", name : '政策动态'},{id : "2", name : '区域动态'},{id : "3", name : '内部动态'}];
	$scope.gStatuses = [{id : '0', name : '草稿'},{id : '1', name : '已发布'},{id : '2', name : '发布历史'}];
	//debugger;
	$scope.initData = {groupType:'1',status : '0'};
	$scope.editWay = "新建"; 
	$scope.id = $stateParams.id;
	// 获取投资问询信息
	if ($scope.id != undefined && $scope.id != "") {
		detailNgService.get({id:$scope.id},function(data){
			$scope.initData = {groupType:data.groupType,status : data.status};
			$scope.editWay = "编辑";
			$scope.viewData = data;
		},function(msg){
			// alert(msg);
		});
	}
	
	// 添加或编辑后的确认按钮事件
	$scope.confirm = function(o) {
		//debugger;
		if (o == false)
			return;
		if ($scope.viewData != null) {
			// console.log($scope.grapTextGroup );
			var p = {
					id : $scope.id == undefined ? "" : $scope.id,
					groupType : $scope.initData.groupType,
					status : $scope.initData.status == undefined ? "0" : $scope.initData.status,
					groupName : $scope.viewData.groupName == undefined ? "" : $scope.viewData.groupName,
					createBy:'',
					createDate:null,
					updateBy:'',
					updateDate:null,
					delFlag:'',
					officeId:'',
					releaseDate:$scope.viewData.releaseDate == undefined ? null : $scope.viewData.releaseDate
			};
		}
		detailNgService.save({crud : p,total:1});
		location.href = '#/crud.html';//保存成功后，返回列表页
	}
	// 点击取消按钮，返回列表页
	$scope.cancel = function() {
		location.href = '#/crud.html';
	}
});
