//This is the main angular module init file ..

var app = angular.module('webPlayer',['ngMaterial']).config(function($mdProgressCircularProvider) {

    // Example of changing the default progress options.
    $mdProgressCircularProvider.configure({
        progressSize: 100,
        strokeWidth: 10,
        duration: 800
    });
}).config(function($mdThemingProvider) {
});
