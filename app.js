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
	},
	anibatchme: {
		url: 'https://www.anibatch.me'
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


angular.module('awsubslite-app', ['infinite-scroll']).controller('awsubslite-app-controller', function($scope, $http, NyanimeService) {
	var query = getQueryParams();
	$scope.animes;

	if (query.state == undefined)
	{
		document.location = '/index.html?state=awsubs';
	}

	$scope.state = query.state;

	if (query.page == undefined) {
		$scope.page = 1;
	} else {
		if (/^\d+$/.test(query.page)) {
			$scope.page = parseInt(query.page);
		}
	}

	$scope.currentState = function(thisState) {
		return (query.state == thisState);
	}

	$scope.nyanime = new NyanimeService($scope.state, $scope.page, function(index) {
		query.page = index;
		$scope.page = index;
		console.log(query.page);
	});

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

	$scope.pageUrl = function(page) {
		return '/index.html?state='+$scope.state+'&page=' + page;
	}

	$scope.reloadPage = function() {
		document.location.reload();
	};
}).controller('awsubslite-download-controller', function($scope, $http, $window, $sce) {
	var query = getQueryParams();
	$scope.details;
	$scope.state = query.state;

	$scope.currentState = function(thisState) {
		return (query.state == thisState);
	}

	$http.get(website.server +  $scope.state + '/getPage/' + query.page).then(function (response) {
		$scope.details = response.data;

		$scope.description = "Free Download Anime " + $scope.details.title + " Nyanime Lite, Nyanime Lite Download" + $scope.details.detail;
		$scope.keyword = $scope.details.title + ",Nyanime Lite,Free Download Anime " + $scope.details.title + ",Website Mirror Anime,"+ $scope.state;
		$scope.canonical = document.location.href;
		
		$scope.content = $sce.trustAsHtml($scope.details.fullDetail);
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
}]).factory('NyanimeService', function($http, $window) {
	var NyanimeService = function(state, index, callback) {
		this.items = [];
		this.busy = false;
		this.index = index;
		this.state = state;
		this.callback = callback;
	};

	NyanimeService.prototype.nextPage = function() {
		if (this.busy) return;
		this.busy = true;

		var url = website.server + this.state + '/getHome/' + this.index;
		$http.get(url).then(function (response) {
			var localItems = response.data.anime;

			for (var i = 0; i < localItems.length; i++) {
				this.items.push(localItems[i]);
			}

			this.callback(this.index);
			this.index += 1;
			this.busy = false;
		}.bind(this));
	};

	return NyanimeService;
});
