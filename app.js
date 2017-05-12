var website = {
    url: 'http://awsubs.co/',
    server: 'https://api.nyancode.web.id/awsubsurl.php?do=get'
};
function getQueryParams() {
    var qs = document.location.search;
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}


angular.module('awsubslite-app', []).controller('awsubslite-app-controller', function($scope, $http) {
    var query = getQueryParams();
    $scope.animes;

    
    if (query.page == undefined) {
        $http.get(website.server).then(function(res) {
            $http.get(res.data.ngrokUrl + 'getHome').then(function (response) {
                $scope.animes = response.data.anime;
            });
        });

    } else {
        if (/^\d+$/.test(query.page)) {
            var i = parseInt(query.page);

            $http.get(website.server).then(function(res) {
                $http.get(res.data.ngrokUrl + 'getHome/' + i).then(function (response) {
                    $scope.animes = response.data.anime;
                });
            });
        }
    }

    $scope.nextUrl = function() {
        if (query.page == undefined) {
            return '/index.html?page=1';
        } else {
            if (/^\d+$/.test(query.page)) {
                var i = parseInt(query.page) + 1;

                return '/index.html?page=' + i;  
            }
        }
    };
}).controller('awsubslite-download-controller', function($scope, $http, $window) {
    var query = getQueryParams();
    $scope.details;

    $http.get(website.server).then(function(res) {
        $http.get(res.data.ngrokUrl + 'getPage/' + query.page).then(function (response) {
            $scope.details = response.data;
        });
    });
    
}).directive('loading', ['$http' ,function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    document.getElementById('loading-indicator').classList.add("is-active");
                }else{
                    document.getElementById('loading-indicator').classList.remove("is-active");
                }
            });
        }
    };
}]).directive('waiting', ['$http' ,function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    document.getElementById('loading-indicator').style.display = 'block';
                }else{
                    document.getElementById('loading-indicator').style.display = 'none';
                }
            });
        }
    };
}]);