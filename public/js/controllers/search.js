'use strict';

/**
 * @ngdoc function
 * @name imageApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the imageApp
 */
angular.module('imageApp')
  .controller('SearchCtrl', ['$http','$rootScope', '$scope','$location',function ($http, $rootScope, $scope, $location) {
    console.log('Search controller')

    $scope.search = function (query){
        console.log('Searching for: '+query);
        if(!query){
            return;
        }
        var req = {
            method: 'GET',
            url: '/api/image/search?q='+query.replace(/ +/g, '+'),
            headers: {
              'Content-Type': 'application/json'
            }
        }
           
        $http(req).then(function(response){
            $location.path('keywords');
        }, function(error){

        });
    }
  }]);
