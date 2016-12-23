
var employeeNgModule = angular.module('standard.employee', ['ngResource']);

var employeeNgService = employeeNgModule.factory('employeeNgService', [
    '$resource',
    function($resource) { 
        var path = '../rest/:moduleName/:serviceName/:methodName?rnd=:random';
        var resource = $resource(path, {}, {
            // findStdOrgansByParentId: {
            //     method: 'GET',
            //     params: {
            //         moduleName: 'standard', 
            //         serviceName: 'architecture', 
            //         methodName: 'findByStdOrganId',
            //         random: Math.random()
            //     }
            // }, 
            findEmployeesByStdOrganId: {
                method: 'GET',
                params: {
                    moduleName: 'standard', 
                    serviceName: 'employee', 
                    methodName: 'findByStdOrganId',
                    random: Math.random()
                }
            }
        });
        return resource; 
    }
 ]); 

var employeeNgCtrl = employeeNgModule.controller('employeeNgCtrl', function($rootScope, $scope, $http, $timeout, employeeNgService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    $scope.listEmployee = [];

    $scope.initTree = function() {
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
                        return '../rest/standard/architecture/childrenById';
                    },
                    'data': function (p_node) {
                        var param = { 'parent': p_node.id };
                        if (p_node.id === '#') {
                            param.parent = null; 
                        }
                        return param;
                    }, 
                    'dataFilter': function(p_response) {
                        p_response = JSON.parse(p_response);
                        var children = [];
                        if (p_response.success) {
                            if (p_response.data !== null) {
                                // 构建树节点数据
                                $.each(p_response.data, function(p_index, p_item) {
                                    // 过滤掉“组织”类型节点，只保留“公司”类型节点
                                    if (p_item.type === 'com') {
                                        children.push({
                                            'id': p_item.stdOrganId,
                                            'text': p_item.name,
                                            'type': p_item.type,
                                            // 'icon': 
                                            // 'state': 
                                            'children': true
                                            // 'li_attr': {}, 
                                            // 'a_attr': {}
                                        });
                                    }
                                }); 
                            }
                        }
                        return JSON.stringify(children);
                    }
                }, 
                'strings': {  
                    'Loading ...': '正在加载...'  
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
        });
        // handle link clicks in tree nodes(support target='_blank' as well)
        $('#treeview').on('select_node.jstree', function(p_event, p_selected) { 
            var nodePath = $('#treeview').jstree('get_path', p_selected.node, ' | ', true);
            console.info(nodePath);
            debugger;
            // employeeNgService.findEmployeesByStdOrganId({
            //     // 'stdOrganId': 'bebbe53cee0643ca886c9b3305a96bb0'
            //     'stdOrganId': p_selected.node.id
            // }, function(p_response) {
            //     debugger;
            //     var response = null; 
            //     if (p_response.success) {
            //         response = {
            //             'data': p_response.data
            //             // 'itemsCount': []
            //         };
            //     }
            //     $("#grid").jsGrid("loadData", response);
            // });
            $('#grid').jsGrid('loadData', {'stdOrganId': p_selected.node.id});
            
        });
    };

    $scope.initTable = function() {
        $("#jsgridEmployee").jsGrid({
            fields: [
                { title: "统一编码", type: "text", width: 95, name: "guid" },
                { title: "员工姓名", type: "text", width: 95, name: "realname", validate: "required" },
                { title: "员工性别", type: "text", width: 95, name: "gender", }, 
                { title: "出生日期", type: "text", width: 75, name: "birthday", }, 
                // { title: "出生日期", type: "checkbox", title: "Is Married", sorting: false },
                // { name: "Country", type: "select", items: countries, valueField: "Id", textField: "Name" },
                { type: "control" }
            ], 
            // data: [], 
            autoload: true, 
            controller: {
                loadData: function(p_filter) {
                    debugger;
                    var def = $.Deferred();
                    // var jqxhr = $.ajax({
                    //     type: "GET",
                    //     url: "../rest/standard/employee/findByStdOrganId",
                    //     data: {
                    //         'stdOrganId': 'bebbe53cee0643ca886c9b3305a96bb0', 
                    //         random: Math.random()
                    //     },
                    //     success: function(p_response) { 
                    //         // default returning an array of data or jQuery promise that will be resolved with an array of data. 
                    //         // when pageLoading is true instead of object the structure { data: [items], itemsCount: [total items count] } should be returned. 
                    //         var response = null; 
                    //         if (p_response.success) {
                    //             response = {
                    //                 'data': p_response.data
                    //                 // 'itemsCount': []
                    //             };
                    //         }
                    //         def.resolve(response);
                    //     }
                    // });
                    var xhr = employeeNgService.findEmployeesByStdOrganId({
                        // 'stdOrganId': 'bebbe53cee0643ca886c9b3305a96bb0'
                        'stdOrganId': ''
                    }, function(p_response) {
                        var response = null; 
                        if (p_response.success) {
                            response = {
                                'data': p_response.data
                                // 'itemsCount': []
                            };
                        }
                        def.resolve(response);
                    });
                    return def.promise();
                } 
            }, 
            width: '100%', // auto
            height: '500', // auto
            heading: true,
            filtering: false,
            inserting: false,
            editing: false,
            selecting: true,
            sorting: false,
            paging: false,
            pageLoading: true
        });
    };

    $scope.init = function() {
        $scope.initTree();
        $scope.initTable(); 

        // employeeNgService.findByStdOrganId({
        //     'stdOrganId': 'bebbe53cee0643ca886c9b3305a96bb0'
        // }, function(p_response) {
        //     $scope.listEmployee = p_response.data;
        // });
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false; 

    $scope.init();
});
