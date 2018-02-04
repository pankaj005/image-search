'use strict';

/**
 * @ngdoc function
 * @name imageApp.controller:KeywordCtrl
 * @description
 * # KeywordCtrl
 * Controller of the imageApp
 */
angular.module('imageApp')
  .controller('KeywordCtrl', ['$http','$rootScope', '$scope','$location',function ($http, $rootScope, $scope, $location) {
    console.log('keywords controller')
    $scope.keywordsList = [];
    //var BASE_URL='http://localhost:3000';
    var getKeywords = function (){
        
        var req = {
            method: 'GET',
            url: '/api/image/search/keywords',
            headers: {
              'Content-Type': 'application/json'
            }
        }
           
        $http(req).then(function(response){
            if(response.status == 200){
                $scope.keywordsList = response.data;
            }
            console.log(response);
        }, function(error){

        });
    }
    getKeywords();

    $scope.getImages = function(img){
        $rootScope.searchQuery = img;
        console.log(img);
        $location.path('images');
    }

  }]);
