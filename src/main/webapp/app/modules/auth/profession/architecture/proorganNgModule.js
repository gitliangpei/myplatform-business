var proorganNgModule = angular.module('profession.proorgan', ['ngResource']);

var proorganNgService = proorganNgModule.factory('proorganNgService', [
    '$resource',
    function($resource) { 
        var path = authPath + '/rest/:moduleName/:serviceName/:methodName?rnd=:random';
        var resource = $resource(path, {}, {
            children: {
                method: 'GET',
                params: {
                    moduleName: 'profession', 
                    serviceName: 'architecture', 
                    methodName: 'childrenById',
                    random: Math.random()
                }
            },
        });
        return resource; 
    }
]);

var proorganNgCtrl = proorganNgModule.controller('proorganNgCtrl', function($rootScope, $scope, $http, $timeout, proorganNgService) {

    $scope.combogridDomId = '';
    $scope.combogridOption = {
        
    };

    $scope.treegridDomId = '';
    $scope.treegridOption = {
        title: '业务组织架构',
        iconCls: 'icon-ok',
        width: '100%',
        height: '400',
        rownumbers: true,
        animate: true,
        collapsible: true,
        fitColumns: true,
        // url: 'treegrid_data2.json',
        // method: 'get',
        idField: 'proOrganId',
        treeField: 'name',
        showFooter: true,
        columns:[[
            {field:'name', title:'业务组织单元', width:180},
            {field:'abbr', title:'业务简称', width:60, align:'right'},
            {field:'proCode', title:'业务编码', width:80},
            {field:'domainId', title:'所属业务域', width:80},
            {field:'remark', title:'备注信息', width:120,
                formatter: function(p_value) {
                    if (p_value) {
                        var html = '';
                        html += '<div style="width:100%;border:1px solid #ccc">';
                        html += '<div style="width:' + p_value + '%;background:#cc0000;color:#fff">' + p_value + '%' + '</div>'
                        html += '</div>';
                        return html;
                    } else {
                        return '';
                    }
                }
            }
        ]],
        loader: function(p_param, p_success, p_error) {
            proorganNgService.children({
                parent: p_param.id
            }, function(p_response) {
                if (p_response.success) {
                    if (p_response.data!==null && p_response.data.length>0) {
                        $.each(p_response.data, function(p_index, p_item) {
                            p_item.state = 'closed';
                        });
                    } else {
                        p_response.data = [];
                    }
                    p_success(p_response.data);
                }
            });
        } 
        // onLoadSuccess: function(row, data) {
        //     if (data.length===0) {
        //         delete row.state;
        //     }
        // }
        // toolbar:'#toolbar'
    };

    $scope.init = function() {
        // TODO
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false; 

    $scope.init();

}); 