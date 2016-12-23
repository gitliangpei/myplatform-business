
var crudNgModule = angular.module('example.crud', ['ngResource','ngCookies']);

//var crudNgService = crudNgModule.factory('crudNgService', [
//    '$resource',
//    function($resource) { 
//        var path = '../rest/:moduleName/:serviceName/:methodName?rnd=:random';
//        var resource = $resource(path, {}, {
//            findcrudsByStdOrganId: {
//                method: 'GET',
//                params: {
//                    moduleName: 'example', 
//                    serviceName: 'crud', 
//                    methodName: 'getByEZQuery',
//                    random: Math.random()
//                }
//            }
//        });
//        return resource; 
//    }
// ]); 

var crudNgCtrl = crudNgModule.controller('crudNgCtrl', function($rootScope, $scope, $http, $cookieStore, $window, $state) {
	
	$scope.test = function(data){
    	alert(data);
    };
	
	//初始化消息类型下拉框
	$scope.gStatuses = [{id : null, name : '全部'},{id : '0', name : '草稿'},{id : '1', name : '已发布'},{id : '2', name : '发布历史'}];
	$scope.selectedStatus=$scope.gStatuses[0];
	
	$scope.gTypes = [{id : null, name : '全部'},{id : '1', name : '政策动态'},{id : '2', name : '区域动态'},{id : '3', name : '内部动态'}];
	$scope.selectedGroupType=$scope.gTypes[0];				
	
	$scope.selectState = function(state) {
		$scope.currentState = state;
	};
	
	//初始化查询条件
	$scope.cookieUrl=$cookieStore.get("crudList");
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
				status:$scope.initQueryObj && $scope.initQueryObj.selectedStatus,
				groupType:$scope.initQueryObj && $scope.initQueryObj.selectedGroupType,
				groupName: $scope.initQueryObj && $scope.initQueryObj.groupName,
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
			if($scope.selectedGroupType && $scope.selectedGroupType.id)
			{
				$scope.Parameters+='&selectedGroupType='+$scope.selectedGroupType.id;
			}
			if($scope.selectedStatus && $scope.selectedStatus.id)
			{
				$scope.Parameters+='&selectedStatus='+$scope.selectedStatus.id;
			}
			if($scope.groupName)
			{
				$scope.Parameters+='&groupName='+$scope.groupName;
			}
		$cookieStore.put('crudList',$scope.Parameters);
		};
		
    //详细页面跳转
    $scope.goTodetails = function(index) {  
    		//location.href = '#/detail.html?id=' + id;
    	var data = $scope.instance.execute('getData').rows[index];
    	alert(data.groupName);
	};
		
	//删除
	$scope.goDelete = function(id) {                               			
		
		if(confirm("确定删除此篇图文？")){
		$http.post("../rest/example/crud/delete/"+id,null).success(
				
				function(data) {            										
					
					$scope.instance.execute('reload');
					
					}).error(
				function() {
					toaster.pop('error', '失败信息',
							'图文删除失败，请重试！');
				});}
	};
	
	$scope.options = {
   			url: "../rest/example/crud/getByEZQuery",//加载的URL
   			idField: "ID",
   			pagination: true,//显示分页
   			pageSize: $scope.queryDto.rows || 20,//分页大小
   			pageList: [5, 10, 15, 20],//每页的个数
   			pageNumber:$scope.queryDto.page || 1,                               			
   			queryParams:{
   				filter:JSON.stringify([
   				    { name : 'delFlag', operator : 'Equal', value : 0 },
   					{ name : 'groupType', operator : 'Equal', value : $scope.queryDto.groupType},
   					{ name : 'groupName', operator : 'Like', value : $scope.queryDto.groupName },
   					{ name : 'status', operator : 'Equal', value : $scope.queryDto.status }])
   			},
   			fit: true,//自动补全
   			fitColumns: true,
   			rownumbers:true,
   			border: true,
   			sortName: 'createDate',
   			sortOrder: 'Desc',
   			toolbar: "#GrapTextGroupListTb",
   			scrollbarSize:0,
   			singleSelect:true,
   			columns: [[//每个列具体内容
   			   { field: 'groupName', title: '图文组名称', width: 150 },
   				{ field: 'groupType', title: '图文类型', width: 250 , formatter: function (value, row, index) {
   					return 	value==1?"政策动态":value==2?"区域动态":value==3?"内部动态":"无";
   				}},
   				{ field: 'status', title: '发布状态', width: 100 , formatter: function (value, row, index) {
   					return 	value==0?"草稿":value==1?"已发布":value==2?"发布历史":"无";
   				}},
   				{field: 'createDate', title: '创建时间', width: 150, formatter:function (value, row, index){
   					return moment(value).format("YYYY-MM-DD");
   				}},
   				{field: 'releaseDate', title: '发布时间', width: 150},
   				{field: 'id', title: '操作', width: 200, formatter: function (value, row, index) {
   					var str = '';
   					str = str + '<button  type="button" class="btn btn-primary btn-xs"'+
						'ng-click="goTodetails(\''+index+'\')">编　辑</button>';
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
		$scope.cookieUrl=$cookieStore.get("crudList");
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
                                  { name : 'delFlag', operator : 'Equal', value : 0 },
                 				  { name : 'groupType', operator : 'Equal', value : $scope.initQueryObj.selectedGroupType},
                 				  { name : 'groupName', operator : 'Like', value : $scope.initQueryObj.groupName },
                 				  { name : 'status', operator : 'Equal', value : $scope.initQueryObj.selectedStatus }])
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
			$cookieStore.put('crudList',$scope.Parameters);

			$scope.selectedGroupType=$scope.gTypes[0];
			$scope.selectedStatus=$scope.gStatus[0];
			$scope.groupName="";

			$scope.cookieUrl=$cookieStore.get("crudList");
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
                    { name : 'delFlag', operator : 'Equal', value : 0 },
   				    { name : 'groupType', operator : 'Equal', value : $scope.initQueryObj.selectedGroupType},
   				    { name : 'groupName', operator : 'Like', value : $scope.initQueryObj.groupName },
   				    { name : 'status', operator : 'Equal', value : $scope.initQueryObj.selectedStatus }])
			});
   		};
    

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false; 
    
});
