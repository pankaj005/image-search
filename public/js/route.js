
 angular.module('imageApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

    // home page
    .when('/', {
      templateUrl: 'views/search.html',
      controller: 'SearchCtrl'
    })

    .when('/images', {
      templateUrl: 'views/images.html',
      controller: 'ImagesCtrl'
    })

    .when('/keywords', {
      templateUrl: 'views/keywords.html',
      controller: 'KeywordCtrl'  
    });

  $locationProvider.html5Mode(true);

}]);