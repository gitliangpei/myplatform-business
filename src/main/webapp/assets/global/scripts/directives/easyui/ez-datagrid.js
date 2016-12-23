angular.module('MetronicApp')
    .directive('ezDataGrid', ['$timeout','$window', '$compile', function ($timeout,$window,$compile) {
        return {
//            scope: {
//            	gridOption: '='
//            },
            scope: false,
            restrict: 'AE',
            replace: true,
            template: function($element) {
                var html = '<div id="' + $element[0].id + '"><table></table></div>';
                return html; 
            },
            //template: ' <div id="myid"> <table class="h-full" ></table></div>',
            link: function (scope, elm, attrs) {
            	if(attrs.height != null){
            		elm.parent().height($window.innerHeight - attrs.height);
            	}
            	else
            	{
            		elm.parent().height($window.innerHeight - 110);
            	}
                
                scope.options.onLoadSuccess = function(data){
                    $compile($datagrid.parent())(scope);
                    if(scope.compute){
                        scope.compute();
                    }
                };
                var $datagrid=$(elm, "table").datagrid(scope.options);
                $datagrid.datagrid('getPager').pagination({
                    onSelectPage:scope.options.onSelectPage,
                    onChangePageSize:scope.options.onChangePageSize
                });
                var instance = {};
                instance.execute = function (method, param) {
                    return $(elm, "table").datagrid(method, param);
                };
                instance.doSearch=function(param){
                    $(elm, "table").datagrid('options').pageNumber=1;
                    return $(elm, "table").datagrid({queryParams:{
                        filter:JSON.stringify(param)
                    }});
                };
                var callback = scope.init();
                callback(instance);
            },
            controller: function ($scope, $element, $attrs, $transclude) { 
            	
                // var opts = $($element).datagrid('options');
                // console.info(opts);
                
                //console.info($scope.element.datagrid('options'));
                //var callback = $scope.init();
                //callback($scope.element);
            }
        };
    }]);