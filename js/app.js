var app = angular.module('favYourself', ['ngStorage', 'ngAnimate'])
    .controller('favYourselfController', function ($timeout, $scope, $localStorage) {
        /*
        * Inititalize variables
        */ 
        // set the home tab to show on load
        $scope.homeTab = true;

        // set the stars count to 0
        $scope.stars = 0;

        // inititalize background image set. 
        // images were picked out from https://unsplash.com/
        $scope.backgroundImages = [
            
                //'res/app/photo-0.jpg',
                'res/app/photo-1.jpg',
                'res/app/photo-2.jpg',
                'res/app/photo-3.jpg',
                'res/app/photo-4.jpg',
                'res/app/photo-5.jpg',
                // 'res/app/photo-6.jpg',
                'res/app/photo-7.jpg',
                'res/app/photo-8.jpg',
                // 'res/app/photo-9.jpg',
                'res/app/photo-10.jpg',
                'res/app/photo-11.jpg',
                // 'res/app/photo-12.jpg',
                'res/app/photo-13.jpg',
                'res/app/photo-14.jpg',
                'res/app/photo-15.jpg',
                'res/app/photo-16.jpg',
                'res/app/photo-17.jpg',
                // 'res/app/photo-18.jpg',
                'res/app/photo-19.jpg',
                'res/app/photo-20.jpg',
                'res/app/photo-21.jpg',
                'res/app/photo-22.jpg',
                'res/app/photo-23.jpg',
                'res/app/photo-24.jpg',
                'res/app/photo-25.jpg',
                'res/app/photo-26.jpg',
                'res/app/photo-27.jpg'

            ];

        $scope.backgroundImageSrc = 'res/app/photo-2.jpg';

        
        /*
        * Utility functions
        */
        
        $scope.switchTab = function(num){
            if(num == 0) {
                $scope.homeTab = true;
            } else{
                $scope.homeTab = false;
            }
        };        
        // changes the background image of the app after every fav is recorded
        $scope.newBackgroundImage = function () {
            // increment the image index
            var idx = $scope.index + 1;
            if (idx >= $scope.backgroundImages.length) idx = 0;

            $scope.index = idx;
            $localStorage.index = idx;

            $scope.backgroundImageSrc = $scope.backgroundImages[idx];
            $localStorage.backgroundImageSrc = $scope.backgroundImageSrc;

            console.log($scope.backgroundImages.length + "  from which " + idx);

            //return $scope.backgroundImages[idx];
        };

        // records the current star rating
        $scope.setStars = function (num) {
            $scope.stars = num;
            $scope.$applyAsync();
            console.log("stars equal to: " + $scope.stars);
        };

        // add a fav in the fav list
        $scope.addFav = function () {
            var currentdate = new Date();
            var id = currentdate.getTime();
            var datetime = "" + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes();


            // record new fav in the first position of the fav list
            $scope.favList.splice(0, 0, {
                favId: id,
                title: $scope.newFavTitle,
                date: datetime,
                stars: $scope.stars
            });

            // save fav list in the local storage
            $localStorage.favList = $scope.favList;

            // clear interface
            $scope.newBackgroundImage();
   
            // clear text input
            $scope.newFavTitle = null;
            // clear stars
            $scope.stars = 0;
          

            //reset star count
            $scope.stars = 0;
        };

        // delete a recorded fav from the fav list
        $scope.deleteFav = function (idx) {
            $scope.favList.splice(idx, 1);
            $localStorage.favList = $scope.favList;

        };
        
        /*
        * Loading the model from the local storage
        */

        if ($localStorage.favList) {
            $scope.favList = $localStorage.favList;
        } else {
            $scope.favList = [];
        }

        if ($localStorage.index) {
            $scope.index = $localStorage.index;
        } else {
            $scope.index = 1;
        }

        if ($localStorage.backgroundImageSrc) {
            $scope.backgroundImageSrc = $localStorage.backgroundImageSrc;
        } else {
            $scope.backgroundImageSrc = 'res/app/photo-0.jpg';
        }
    });

app.directive('fadeIn', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {
            $element.addClass("ng-remove");
            console.log('hide previouse image');
            $element.on('load', function () {
                $element.addClass("ng-add");
                console.log('loaded image');

            });
        }
    }
});