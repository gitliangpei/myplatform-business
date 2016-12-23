angular.module('MetronicApp')
    .directive('ezTreeGrid', ['$timeout','$window', '$compile', function ($timeout,$window,$compile) {
        return {
            //scope: {
            //    options: '=',
            //    init: '&'
            //},
            scope: false,
            restrict: 'AE',
            replace: true,
            template: ' <div id="myid"> <table class="h-full" ></table></div>',
            link: function (scope, elm, attrs) {
                //elm.parent().height($window.innerHeight - 110);
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

                scope.options.onLoadSuccess = function(data){
                    $compile($treegrid.parent())(scope);
                };
                var $treegrid=$(elm, "table").treegrid(scope.options);
                $treegrid.treegrid('getPager').pagination({
                    onSelectPage:scope.options.onSelectPage,
                    onChangePageSize:scope.options.onChangePageSize
                });
                var instance = {};
                instance.execute = function (method, param) {
                    return $(elm, "table").treegrid(method, param);
                };
                instance.doSearch=function(param){
                    $(elm, "table").treegrid('options').pageNumber=1;
                    return $(elm, "table").treegrid({queryParams:{
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