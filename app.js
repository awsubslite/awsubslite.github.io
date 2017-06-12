var website = {
	server: 'https://nyanime-lite-ryanaunur.c9users.io:8081/api/',
	awsubs: {
		url: 'http://awsubs.me/'
	},
	samehadaku: {
		url: 'https://samehadaku.net/'
	},
	conanwebid: {
		url: 'http://conan.web.id'
	},
	oploverz: {
		url: 'http://www.oploverz.in'
	}
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

	if (query.state == undefined)
	{
		document.location = '/index.html?state=awsubs';
	}

	$scope.state = query.state;

	$scope.currentStateAwsubs = function() {
		return (query.state == "awsubs") ? true : false;
	};
	$scope.currentStateSamehada = function() {
		return (query.state == "samehadaku") ? true : false;
	};
	$scope.currentStateConanWebId = function() {
		return (query.state == "conanwebid") ? true : false;
	};
	$scope.currentStateOploverz = function() {
		return (query.state == "oploverz") ? true : false;
	};

	if (query.page == undefined) {
		$http.get(website.server + $scope.state + '/getHome').then(function (response) {
			$scope.animes = response.data.anime;
		});

	} else {
		if (/^\d+$/.test(query.page)) {
			var i = parseInt(query.page);

			$http.get(website.server + $scope.state + '/getHome/' + i).then(function (response) {
				$scope.animes = response.data.anime;
			});
		}
	}

	$scope.nextUrl = function() {
		if (query.page == undefined) {
			return '/index.html?state='+$scope.state+'&page=2';
		} else {
			if (/^\d+$/.test(query.page)) {
				var i = parseInt(query.page) + 1;

				return '/index.html?state='+$scope.state+'&page=' + i;  
			}
		}
	};

	$scope.reloadPage = function() {
		document.location.reload();
	};
}).controller('awsubslite-download-controller', function($scope, $http, $window) {
	var query = getQueryParams();
	$scope.details;
	$scope.state = query.state;

	$scope.currentStateAwsubs = function() {
		return (query.state == "awsubs") ? true : false;
	};
	$scope.currentStateSamehada = function() {
		return (query.state == "samehadaku") ? true : false;
	};
	$scope.currentStateConanWebId = function() {
		return (query.state == "conanwebid") ? true : false;
	};
	$scope.currentStateOploverz = function() {
		return (query.state == "oploverz") ? true : false;
	};

	$http.get(website.server +  $scope.state + '/getPage/' + query.page).then(function (response) {
		$scope.details = response.data;
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
