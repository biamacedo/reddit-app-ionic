(function(){
var app = angular.module('myreddit', ['ionic', 'angularMoment']);

app.controller('RedditCtrl', function($http, $scope){

    $scope.stories = [];

    function loadStories(params, callback){
        $http.get('http://www.reddit.com/r/android/new/.json', {params: params})
        .success(function(response){
            var stories = [];
            angular.forEach(response.data.children, function(child){
                var story = child.data;
                if (!story.thumbnail || story.thumbnail === 'self' || story.thumbnail === 'default'){
                    story.thumbnail = 'http://www.redditstatic.com/icon.png';
                }
                stories.push(story);
            });
            callback(stories);
        });
    };

    $scope.loadOlderStories = function(){
        var params = {};
        if ($scope.stories.length > 0){
            params['after'] = $scope.stories[$scope.stories.length - 1].name;
        }
        loadStories(params, function(olderStories){
            $scope.stories = $scope.stories.concat(olderStories);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.loadNewerStories = function(){
        var params = {'before': $scope.stories[0].name};
        loadStories(params, function(newerStories){
            $scope.stories = newerStories.concat($scope.stories);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());
