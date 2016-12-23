
var stdorganNgModule = angular.module('standard.stdorgan', ['ngResource']);

var stdorganNgService = stdorganNgModule.factory('stdorganNgService', [
    '$resource',
    function($resource) { 
        var path = '../rest/:moduleName/:serviceName/:methodName?rnd=:random';
        var resource = $resource(path, {}, {
            children: {
                method: 'GET',
                params: {
                    moduleName: 'standard', 
                    serviceName: 'architecture', 
                    methodName: 'childrenById',
                    random: Math.random()
                }
            },
            pie: {
                method: 'GET',
                params: {
                    moduleName: 'elecMonitor', 
                    methodName: 'createElecPie',
                    Code :'@code',
                    random: Math.random()
                }
            },
            load: {
                method: 'GET',
                params: {
                    moduleName: 'powerSwitch', 
                    methodName: 'homeLoadRate',
                    stationCode :'@stationCode',
                    Time: 'day',
                    random: Math.random()
                }
            }
        });
        return resource; 
    }
]);

var stdorganNgCtrl = stdorganNgModule.controller('stdorganNgCtrl', function($rootScope, $scope, $http, $timeout, stdorganNgService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    $scope.dataStdOrgan = [];
    $scope.currentStdOrgan = null;

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
                                // 记录原始数据
                                $scope.updateStdOrganData(p_response.data);
                                // 构建树节点数据
                                $.each(p_response.data, function(p_index, p_item) {
                                    children.push({
                                        'id': p_item['stdOrganId'],
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
                            // var inst = jQuery.jstree.reference(data.reference),  
                            // obj = inst.get_node(data.reference);  
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
        $('#treeview').on('select_node.jstree', function(p_event, p_selected) { 
            var nodePath = $('#treeview').jstree('get_path', p_selected.node, ' | ', true);
            console.info(nodePath);
        });
        
        $('#treeview').on('select_node.jstree', function() {
            // TODO
        });

        // $('#treeview').on('hover_node.jstree', function(p_event, p_node) {
        //     console.log(p_node.node.id);
        // });
        // $('#treeview').on('dehover_node.jstree', function(p_event, p_node) {
        //     console.log(p_node.node.id);
        // });
        // $scope.loadTreeviewChildren(null);
    };

    $scope.updateStdOrganData = function (p_data) {
        if (p_data==null || p_data.length==0) {
            return;
        }
        // 根节点数据
        if (p_data[0]['parentStdOrganId']===null) {
            $scope.dataStdOrgan = $scope.dataStdOrgan.concat(p_data);
            return;
        }
        // Tree NodeId Path
        var parentId = p_data[0]['parentStdOrganId'];
        var parentIds = [];
        parentIds.push(parentId);
        parentId = $('#treeview').jstree('get_parent', parentId);
        while (parentId!=null && parentId!='#') {
            parentIds.unshift(parentId);
            parentId = $('#treeview').jstree('get_parent', parentId);
        }
        // Traverse Data
        var target = null;
        $.each(parentIds, function(p_index, p_item) {
            if (p_index===0) {
                $.each($scope.dataStdOrgan, function(p_index1, p_item1) {
                    if (p_item1['stdOrganId']===p_item) {
                        target = p_item1;
                        return true;
                    }
                });
            }
            if (target!==null && target['children']!==null && target['children'].length>0) {
                $.each(target['children'], function(p_index2, p_item2) {
                    if (p_item2['stdOrganId']===p_item) {
                        target = p_item2;
                        return true;
                    }
                });
            }
        });
        target['children'] = p_data;
        console.log($scope.dataStdOrgan);
    };

    $scope.init = function () {
        $scope.initTree();
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false; 

    $scope.init();
}); 
