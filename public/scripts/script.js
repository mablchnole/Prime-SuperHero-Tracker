var myApp = angular.module('myApp', ['ngRoute']);

// config our routes
myApp.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/entry', {
      templateUrl: '../routes/hero-entry.html',
      controller: 'EntryController'
    }).
    when('/list', {
      templateUrl: '../routes/hero-list.html',
      controller: 'ListController'
    }).
    otherwise({
      redirectTo: '/entry'
    });
}]); // end config routes

// controller to enter new heroes
myApp.controller('EntryController', ['$scope', '$http', function($scope, $http){
  console.log('Loaded EntryController');
  // ng-click function to add hero
  $scope.getInput = function(){
    event.preventDefault();
    console.log('getInput button clicked');
    // get the user input and store in object
    var heroToSend = {
      alias: $scope.aliasIn,
      first_name: $scope.firstNameIn,
      last_name: $scope.lastNameIn,
      city: $scope.cityIn,
      power_name: $scope.powerNameIn
    }; // end heroToSend
    // post route to create data
    $http({
      method: 'POST',
      url: '/addHero',
      data: heroToSend
    }); // end post route
    // clears input fields
    $scope.aliasIn = '';
    $scope.firstNameIn = '';
    $scope.lastNameIn = '';
    $scope.cityIn = '';
    $scope.powerNameIn = '';
  }; // end getInput
}]); // end EntryController

// controller to view list of heroes
myApp.controller('ListController', ['$scope', '$http', function($scope, $http){
  $scope.heroRecords = [];
  //retrieve hero records
  $scope.getHeroes = function(){
    $http({
      method: 'GET',
      url: '/getHero',
    }).then(function(response){
      $scope.heroRecords = response.data;
    }, function myError(response){
      console.log(response.statusText);
    }); // end get route
  }; // end getHeroes

  $scope.getHeroes();

  // delete hero from dom and db on ng-click
  $scope.deleteHero = function(index){
    var heroToDelete = $scope.heroRecords[index];
    $scope.heroRecords.splice(index, 1);
    var heroId = {
      id: heroToDelete._id
    }; // end heroId object
    // post route to update data
    $http({
      method: 'POST',
      url: '/deleteHero',
      data: heroId
    }); // end post route
  }; // end deleteHero
}]); // end ListController


// directive to alert user of successful addition of new hero
myApp.directive('ngConfirmClick', [function(){
  return{
    link: function (scope, element, attr){
      var msg = attr.ngConfirmClick || "Are you sure?";
      var clickAction = attr.confirmedClick;
      element.bind('click',function(event){
        if(window.confirm(msg)){
          scope.$eval(clickAction);
        }
      });
    }
  };
}]);
