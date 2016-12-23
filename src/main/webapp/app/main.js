/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    'ngResource',
    'ui.router', 
    'ui.bootstrap', 
    'oc.lazyLoad',  
    'ngSanitize',
    'xeditable',
    'toaster'
]),authList; 

var httpService = MetronicApp.factory('httpService', ['$http','$q', '$window', 'toaster', function($http, $q, $window, toaster){
	var service = {};
	
	service.get = function(options){
		
		var deferred = $q.defer();
		var accessUrl =  options.url;
		
		$http.get(accessUrl)
			.success(function (data) {
				deferred.resolve(data);
			})
			.error(function(msg){
				
				if(options.errorMsg) toaster.pop('error', '失败', options.errorMsg + msg);
				else toaster.pop('error', '失败', msg);
				
				deferred.reject(msg);
			});
		return deferred.promise;
	};
	
	service.post = function(options){
		var deferred = $q.defer();
		var accessUrl = $window.location.origin + options.url;
		
		$http.post(accessUrl, options.data)
			.success(function (data) {
				if(!(options.showSuccessMsg===false)){
					if(options.successMsg) toaster.pop('success', '成功', options.successMsg);
					else toaster.pop('success', '成功', '操作成功！');
				}
				
				deferred.resolve(data);
			})
			.error(function(msg){
				
				if(options.errorMsg) toaster.pop('error', '失败', options.errorMsg + msg);
				else toaster.pop('error', '失败', msg);
				
				deferred.reject(msg);
			});
		return deferred.promise;
	};
	
	return service;
}]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config([
    '$ocLazyLoadProvider', 
    function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // 用来开启debug模式。布尔值，默认是false。开启debug模式时，$ocLazyLoad会打印出所有的错误到console控制台上。 
            debug: true, 
            // 当动态加载了module的时候，$ocLazyLoad会广播相应的事件。布尔值，默认为false。
            events: true, 
            // 用于定义需要动态加载的模块。定义每个模块的名字需要唯一。 modules必须要用数组的形式，其中files也必须以数组的形式存在，哪怕只需要加载一个文件。
            // modules: [{
            //     name: 'stdorganNgModule', 
            //     files: [
            //         './modules/standard/architecture/stdorganNgCtrl.js'
            //     ]
            // }] 
        });
    }
]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
         assetsPath: '../assets',
         globalPath: '../assets/global',
         layoutPath: '../assets/layouts/layout',
//        assetsPath: '../assets',
//        globalPath: '../assets/metronic/global',
//        layoutPath: '../assets/metronic/layouts/layout',
        themesPath: '../assets',
        mediaPath:  '../assets/pages/media'
    };
    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        //读取登录人名
        $.get('../rest/security/loginName', function(data) {  
        	$scope.loginName = data;  
          });  
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', '$http', function($scope, $http) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
        //读取菜单
        $http.get('../rest/auth/menu/menus').success(function (data) {
        	$scope.menuDtos = data;
        });
        
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) { 
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar 
        }, 2000);
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
     $urlRouterProvider.otherwise("/dashboard.html"); 
//    $urlRouterProvider.otherwise("/crud.html"); 
    
    $stateProvider

        // 基准组织架构
        .state('stdorgan', {
            url: "/stdorgan.html", 
            templateUrl: "./modules/standard/architecture/stdorgan.html", 
            data: {pageTitle: 'Admin Dashboard Template'}, 
            controller: "stdorganNgCtrl", 
            //  resolve 里的属性如果返回的是 promise对象，那么resolve将会在控制器加载以及$routeChangeSuccess被触发之前执行，即view加载之前执行。
            resolve: { 
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    // 在这里可以延迟加载任何文件或者已预定义的modules
                    return $ocLazyLoad.load({
                        name: 'stdorganNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../vendor/jquery-jstree-3.3.2/themes/default/style.min.css',
                            '../vendor/jquery-jstree-3.3.2/jstree.min.js',
                            './modules/standard/architecture/stdorganNgModule.js' 
                        ] 
                    });
                }]
            }
        })

        // 示例-crud
        .state('crud', {
            url: "/crud.html", 
            templateUrl: "./modules/example/crud/crud.html", 
            data: {pageTitle: 'crud示例'}, 
            controller: "crudNgCtrl", 
            resolve: { 
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'crudNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/scripts/directives/easyui/ez-datagrid.js',
                            './modules/example/crud/crudNgModule.js' 
                        ] 
                    });
                }]
            }
        })
        //详细页面
        .state('detail',{
        	url : "/detail.html?id=",
        	templateUrl: "./modules/example/crud/detail.html", 
            data: {pageTitle: '详细页面'}, 
            controller: "detailNgCtrl",
            resolve: { 
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'detailNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            './modules/example/crud/detailNgModule.js' 
                        ] 
                    });
                }]
            }
        })
        //示例-工作流-请假流程
        .state('leave',{
        	url : "/leave.html",
        	templateUrl: "./modules/example/workflow/list.html", 
        	data: {pageTitle: '请假流程'}, 
        	controller: "LeaveController",
        	resolve: { 
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
        			return $ocLazyLoad.load({
        				name: 'listNgModule',
        				insertBefore: '#ng_load_plugins_before', 
        				files: [
        				        './modules/example/workflow/listNgModule.js' 
        				        ] 
        			});
        		}]
        	}
        })
        //示例-工作流-请假流程-待办
        .state('task',{
        	url : "/task.html",
        	templateUrl: "./modules/example/workflow/task.html", 
        	data: {pageTitle: '待办任务'}, 
        	controller: "TaskController",
        	resolve: { 
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
        			return $ocLazyLoad.load({
        				name: 'taskNgModule',
        				insertBefore: '#ng_load_plugins_before', 
        				files: [
        				        './modules/example/workflow/taskNgModule.js' 
        				        ] 
        			});
        		}]
        	}
        })
        //示例-工作流-请假流程-待办
        .state('finished',{
        	url : "/finished.html",
        	templateUrl: "./modules/example/workflow/finished.html", 
        	data: {pageTitle: '已办任务'}, 
        	controller: "FinishedController",
        	resolve: { 
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
        			return $ocLazyLoad.load({
        				name: 'finishedNgModule',
        				insertBefore: '#ng_load_plugins_before', 
        				files: [
        				        './modules/example/workflow/finishedNgModule.js' 
        				        ] 
        			});
        		}]
        	}
        })
        
//		基准机构管理
			.state('stdwj',{
				url : "/stdorganlist.html",
				templateUrl: "./modules/auth/org/stdorgan/stdorganlist.html", 
				data: {pageTitle: '基准机构管理'}, 
				controller: "stdorgan_workjob_listNgCtrl",
				resolve: { 
					deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'stdorganNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/scripts/directives/easyui/ez-treegrid.js',
                            './modules/auth/org/stdorgan/stdorganlistNgModule.js' 
                        ] 
                    });
                }]
            }
        })
        //机构对应人员管理
			.state('stdorganEmployee',{
				//abstract : true,
				url : "/stdorganEmployee.html",
				templateUrl: "./modules/auth/org/employee/stdorganEmployee.html", 
				data: {pageTitle: '机构对应人员管理'}, 
				controller: "stdorganEmployeeNgCtrl",
				resolve: { 
					deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'stdorganEmployeeNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/scripts/directives/easyui/ez-treegrid.js',
                            '../assets/global/scripts/directives/easyui/ez-datagrid.js',
                            /*'../vendor/bootstrap-fileinput/bootstrap-fileinput.css',  
                            '../vendor/bootstrap-fileinput/bootstrap-fileinput.js',*/
                            './modules/auth/org/employee/stdorganEmployeeNgModule.js' 
                        ] 
                    });
                }]
            }
        })
        //权限管理 
        .state('permission',{
        	url : "/permission.html",
        	templateUrl : "./modules/auth/permission/permission.html",
        	data : {pageTitle : 'Admin Dashboard Template'},
        	controller : "permissionNgCtrl",
        	resolve : {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'permissionNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/scripts/directives/easyui/ez-datagrid.js',
                            './modules/auth/permission/permissionNgModule.js' 
                        ] 
                    });
                }]
        	}
        })
        //资源管理 
        .state('resource',{
        	url : "/resourcelist.html",
        	templateUrl : "./modules/auth/resource/resourcelist.html",
        	data : {pageTitle : 'Admin Dashboard Template'},
        	controller : "resourceNgCtrl",
        	resolve : {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'resourceNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../vendor/angular-ui-grid/ui-grid.bootstrap.css',
                            '../vendor/angular-ui-grid/ui-grid.min.css',
                            '../vendor/angular-ui-grid/ui-grid.js',
                            '../vendor/angular-ui-grid/ui-grid.min.js',
                            '../vendor/angular-ui-select/dist/select.min.js',
                            '../vendor/angular-ui-select/dist/select.min.css',
                            '../vendor/ng-hierarchical-selector/ng-hierarchical-selector.0.5.0.min.css',
                            '../vendor/ng-hierarchical-selector/ng-hierarchical-selector.0.5.0.js',
                            '../assets/global/scripts/directives/easyui/ez-datagrid.js',
                            './modules/auth/resource/resourceNgModule.js' 
                        ] 
                    });
                }]
        	}
        })
        //菜单管理
        .state('menu',{
        	url : "/menulist.html",
        	templateUrl : "./modules/auth/menu/menulist.html",
        	data : {pageTitle : '菜单管理'},
        	controller : "menuNgCtrl",
        	resolve : {
        		deps : ['$ocLazyLoad',function($ocLazyLoad) {
        			return $ocLazyLoad.load({
        				name : 'menuNgModule',
        				insertBefore : '#ng_load_plugins_before',
        				files : [
        				    '../assets/global/scripts/directives/easyui/ez-treegrid.js',
        				    './modules/auth/menu/menuNgModule.js'
        				]
        			});
        		}]
        	}
        })
        //角色管理 
        .state('role',{
        	url : "/rolelist.html",
        	templateUrl : "./modules/auth/role/rolelist.html",
        	data : {pageTitle : '角色管理'},
        	controller : "roleNgCtrl",
        	resolve : {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'roleNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/css/style.css',
                            '../vendor/jquery-easyui-1.5/themes/demo.css',
                            '../assets/global/scripts/directives/easyui/ez-datagrid.js',
                            './modules/auth/role/roleNgModule.js' 
                        ] 
                    });
                }]
        	}
        })
        //职责管理 
        .state('duty',{
        	url : "/dutylist.html",
        	templateUrl : "./modules/auth/duty/dutylist.html",
        	data : {pageTitle : '职责管理'},
        	controller : "dutyNgCtrl",
        	resolve : {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                    return $ocLazyLoad.load({
                        name: 'dutyNgModule',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
							'../vendor/angular-ui-grid/ui-grid.bootstrap.css',
							'../vendor/angular-ui-grid/ui-grid.min.css',
							'../vendor/angular-ui-grid/ui-grid.js',
							'../vendor/angular-ui-grid/ui-grid.min.js',
							'../vendor/angular-ui-select/dist/select.min.js',
							'../vendor/angular-ui-select/dist/select.min.css',
							'../vendor/ng-hierarchical-selector/ng-hierarchical-selector.0.5.0.min.css',
							'../vendor/ng-hierarchical-selector/ng-hierarchical-selector.0.5.0.js',
							
                            '../assets/global/scripts/directives/easyui/ez-datagrid.js',
                            './modules/auth/duty/dutyNgModule.js' 
                        ] 
                    });
                }]
        	}
        })
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "./modules/dashboard/dashboard.html", 
            data: {pageTitle: 'Admin Dashboard Template'}, 
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../vendor/morris-0.5.1/morris.css', 
                            '../vendor/morris-0.5.1/morris.min.js',
                            '../vendor/raphael-2.2.0/raphael.min.js', 
                            '../vendor/jquery-sparkline-2.1.2/jquery.sparkline.min.js',
                            './modules/dashboard/dashboard.js',
                            './modules/dashboard/dashboardNgCtrl.js',
                        ] 
                    });
                }]
            }
        })
        // 业务域管理
							.state(
									'domain',
									{
										url : "/domain.list.html",
										templateUrl : "./modules/auth/domain/domain.list.html",
										data : {
											pageTitle : '详细页面'
										},
										controller : "domainNgCtrl",
										resolve : {
											deps : [
													'$ocLazyLoad',
													function($ocLazyLoad) {
														return $ocLazyLoad
																.load({
																	name : 'domainNgModule',
																	insertBefore : '#ng_load_plugins_before',
																	files : [
																			'./modules/auth/domain/domain.js',
																			'../assets/global/scripts/directives/easyui/ez-datagrid.js'

																	]
																});
													} ]
										}
									})
									
									// 业务机构
							.state(
									'proorgan',
									{
										url : "/proorgan.html",
										templateUrl : "./modules/auth/proorgan/proorgan.html",
										data : {
											pageTitle : '详细页面'
										},
										controller : "prooRganNgCtrl",
										resolve : {
											deps : [
													'$ocLazyLoad',
													function($ocLazyLoad) {
														return $ocLazyLoad
																.load({
																	name : 'prooRganNgModule',
																	insertBefore : '#ng_load_plugins_before',
																	files : [
																			'../assets/global/scripts/directives/easyui/ez-treegrid.js',// 加载顺序，加载daioyong
																			'../assets/global/scripts/directives/easyui/ez-datagrid.js',
																			'../vendor/jquery-mockjax/jquery.mockjax.js',
																			'../vendor/jquery-jstree-3.3.2/themes/default/style.min.css',
																			'./modules/auth/proorgan/proorgan.js' ]
																});
													} ]
										}
									})
// 业务应用（平台端）
							.state(
									'appdomain',
									{
										url : "/app.domain.list.html",
										templateUrl : "./modules/auth/domain/app.domain.list.html",
										data : {
											pageTitle : '详细页面'
										},
										controller : "domainNgCtrl",
										resolve : {
											deps : [
													'$ocLazyLoad',
													function($ocLazyLoad) {
														return $ocLazyLoad
																.load({
																	name : 'domainNgModule',
																	insertBefore : '#ng_load_plugins_before',
																	files : [
																			'./modules/auth/domain/app.domain.js',
																			'../assets/global/scripts/directives/easyui/ez-datagrid.js'

																	]
																});
													} ]
										}
									})




        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'  
                        ] 
                    });
                }]
            }
        });

}]);

/* Init global settings and run the app */
MetronicApp.run([
    "$rootScope", "settings", "$state", 
    function($rootScope, settings, $state) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
    }
]);