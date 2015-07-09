angular.module('App', ['ngRoute', 'App.services', 'App.controllers','geolocation','ui.bootstrap','ngStorage','ngTouch'])
    .config(function($httpProvider){

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/register', {
                controller: 'RegistCtrl',
                templateUrl: 'partials/register.html'
            })
            .when('/round', {
                templateUrl: 'partials/round.html',
                controller: 'RoundCtrl'
            })
            .when('/display', {
                controller: 'TeeCtrl',
                templateUrl: 'partials/display.html'
            })
            .when('/comment', {
                controller: 'commentCtrl',
                templateUrl: 'partials/comment.html'
            })

            .when('/practice', {
                controller: 'practiceCtrl',
                templateUrl: 'partials/practice.html'
            })

            .when('/result', {
                controller: 'resultCtrl',
                templateUrl: 'partials/result.html'
            })
            .when('/setting', {
                controller: 'settingCtrl',
                templateUrl: 'partials/setting.html'
            })
            .when('/', {
                controller: 'mainCtrl',
                templateUrl: 'partials/index.html'
            })
            .when('/login', {
                controller: 'loginCtrl',
                templateUrl: 'partials/login.html'
            })
            .otherwise({redirectTo: '/'});
    })
function isPhoneGap() {
    return (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1)
}

document.addEventListener('deviceready', function () {
    angular.bootstrap(document, ['App']);
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown() {
}
