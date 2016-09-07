var app = angular.module('favYourself', ['ngRoute', 'ngStorage']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/favInput', {
                templateUrl: 'partials/favInput.html',
                controller: 'favInputController'
              })
        .when('/favStats', {
            templateUrl: 'partials/favStats.html',
            controller: 'favStatsController'      
        })
        .otherwise({
            redirectTo: '/favInput'
        })
});

app.service('tabsService', function () {
    var tabs = [true, false];

    return {
        getTabs: function () {
            return tabs;
        },
        setTabs: function (tabList) {
            tabs = tabList;
        },
        showTab: function (idx) {
            return tabs[idx];
        }
    }

});

app.service('backgroundService', function ($q, $http) {
    
    var backgroundImages = [];    
    var deferred = $q.defer();
    
    var getRandomInt = function(min, max) { // min (integer, inclusive), max (integer, inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }    
    
    this.currentBackground = '';
    this.change = 'background-img-show';
    
    this.getImages = function() {
        return $http.get('res/app/background-list.json')
            .then(function(response){
                deferred.resolve(response);
                return deferred.promise;
            }, function (response) {
                deferred.reject(response);
                return deferred.promise;
        });
    };
        
    this.setImages = function(imageSet) {
        backgroundImages = imageSet;
    }
    
    this.setNextImage = function () {           
            this.currentBackground = backgroundImages[getRandomInt(0,backgroundImages.length-1)];
    };   
    
});

app.service('favService', ['$localStorage', function ($localStorage) {
    var stats = [];
    console.log($localStorage.favStats);
    return {
        getStats: function () {
            if (!$localStorage.favStats) {
                return stats;
            } else {
                stats = $localStorage.favStats;
                console.log(stats);
                return stats;
            }
            
        },
        addFav: function (fav) {
            stats.unshift(fav);
            $localStorage.favStats = stats;
        },
        deleteFav: function (idx) {
            stats.splice(idx, 1);
            $localStorage.favStats = stats;
        }
    }
}]);

app.controller('tabController', function ($scope, tabsService) {

    // the home tab is selected by default
    $scope.tabs = tabsService.getTabs();

    //reset the tab list
    $scope.resetTabs = function () {
        for (var i = 0; i < $scope.tabs.length; i++) {
            $scope.tabs[i] = false;
        }
    };

    $scope.setSelectedTab = function (nr) {
        $scope.tabs[nr] = true;
        tabsService.setTabs($scope.tabs);
    };

    $scope.selectTab = function (tabName) {
        // reset the tabs selection
        $scope.resetTabs();

        // set the selected tab
        switch (tabName) {
        case 'home':
            // set the home tab to true
            $scope.setSelectedTab(0);
            console.log('switch to HOME');
            break;

        case 'stats':
            // set the home tab to true
            $scope.setSelectedTab(1);
            console.log('switch to STATS');
            break;
        };

    };


});

app.controller('backgroundController', function ($scope, $q, backgroundService) {
   
    $scope.background = backgroundService;
    
    backgroundService.getImages().then(
        function(response) {
            backgroundService.setImages(response.data);
            backgroundService.setNextImage();    
            $scope.background.currentBackground = backgroundService.currentBackground;  
        }, function(error) {
            $scope.background.currentBackground = 'res/app/logo.png';
            
        });   
     
    
});

app.controller('favInputController', function ($scope, $timeout, favService, backgroundService) {

    $scope.newFav = {
        stars: 0,
        reason: '',
        date: ''
    };

    $scope.stars = [
        {
            src: 'res/app/star_border.svg'
         },
        {
            src: 'res/app/star_border.svg'
         },
        {
            src: 'res/app/star_border.svg'
         },
        {
            src: 'res/app/star_border.svg'
         },
        {
            src: 'res/app/star_border.svg'
         }

     ];

    $scope.resetStars = function () {
        for (var i = 0; i < $scope.stars.length; i++) {

            $scope.stars[i].src = 'res/app/star_border.svg'
        }

        $scope.newFav.stars = 0;
    };

    $scope.resetReason = function () {
        $scope.newFav.reason = '';
    };

    $scope.setStars = function (idx) {

        $scope.resetStars();

        for (var i = 0; i <= idx; i++) {
            $scope.stars[i].src = 'res/app/star_white.svg';
        };

        $scope.newFav.stars = idx+1;
    };
    
    

    $scope.addFav = function () {

        var now = new Date();
        $scope.newFav.date = now.toLocaleDateString('en-GB');

        // make a new fav object and call the favService add function
        var newFav = {
            stars: $scope.newFav.stars,
            reason: $scope.newFav.reason,
            date: $scope.newFav.date
        };

        favService.addFav(newFav);

        // clear the UI
        $scope.resetStars();
        $scope.resetReason();

        //increment the background index
        // first, hide the <img>
        backgroundService.change = 'background-img-hide';
        
        // second, set the new background src
        $timeout(function(){            
            backgroundService.setNextImage();
        }, 501);
        
        // third, show the <img> with the new src
        $timeout(function(){            
            backgroundService.change = 'background-img-show';
        }, 700);        
        
        
    };
});

app.controller('favStatsController', function ($scope, favService) {

    $scope.favStats = favService.getStats();

    $scope.deleteFav = function (idx) {

        favService.deleteFav(idx);

        $scope.favStats = favService.getStats();

    };
});