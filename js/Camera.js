/**
 * Created by joylin on 3/4/14.
 */
'use strict';
// Fallback for desktop testings
var Camera = Camera || {
    PictureSourceType: {
        PHOTOLIBRARY : 0,
        CAMERA : 1,
        SAVEDPHOTOALBUM : 2
    },
    DestinationType: {
        DATA_URL : 0,
        FILE_URI : 1,
        NATIVE_URI : 2
    },
    EncodingType: {
        JPEG : 0,
        PNG : 1
    },

    Direction: {
        BACK : 0,
        FRONT : 1
    }
};
var log=[];
angular.module('Camera', [])
    .factory('Camera', ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
        log.push(navigator);
        return {
            getPicture: function (onSuccess, onError, options) {
                console.log($window, $window.navigator);
                $window.navigator.camera.getPicture(onSuccess, onError, options);
            },
            cleanup: function (onSuccess, onError) {
                $window.navigator.camera.cleanup(onSuccess, onError);
            },
            PictureSourceType: Camera.PictureSourceType,
            DestinationType: Camera.DestinationType,
            EncodingType: Camera.EncodingType,
            MediaType: Camera.MediaType,
            Direction: Camera.Direction

        };
    }]);