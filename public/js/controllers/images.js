'use strict';

/**
 * @ngdoc function
 * @name imageApp.controller:ImagesCtrl
 * @description
 * # ImagesCtrl
 * Controller of the imageApp
 */
angular.module('imageApp')
  .controller('ImagesCtrl', ['$http','$rootScope', '$scope','$location',function ($http, $rootScope, $scope, $location) {
    console.log('Images controller')
        

        $scope.images = [];
        
        var getImages = function (){
            if(!$rootScope.searchQuery){
                return;
            }
            var req = {
                method: 'GET',
                url: '/api/image/search?q='+$rootScope.searchQuery.replace(/ +/g, '+'),
                headers: {
                  'Content-Type': 'application/json'
                }
            }
               
            $http(req).then(function(response){
                if(response.status == 200){
                    $scope.images = response.data.images || [];
                }
                console.log(response);
            }, function(error){
    
            });
        }
        getImages();
    
  }]);
