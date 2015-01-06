app.directive('myDownload', function ($compile) {
    return {
        restrict:'E',
        scope:{ getUrlData:'&getData'},
        // template: '<a class="btn" download="backup.json"' +
        //             'href="{{url}}">' +
        //             'Download' +
        //             '</a>',
        link:function (scope, elm, attrs) {
            var url = URL.createObjectURL(scope.getUrlData());
            elm.append($compile(
                '<a class="btn" download="logs.json"' +
                    'href="' + url + '">' +
                    '<span class="glyphicon glyphicon-download"></span>' +
                    '</a>'
            )(scope));
        }
    };
});