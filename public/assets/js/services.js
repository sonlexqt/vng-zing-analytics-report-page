var servicesModule = angular.module('zaApp.Services', []);

var CHAT_SERVICE_FIREBASE_URL = 'https://za-report-chat.firebaseio.com/';

servicesModule.factory('ChatService', ['$rootScope', '$firebaseArray', '$firebaseObject', function($rootScope, $firebaseArray, $firebaseObject) {
    var firebaseRef = new Firebase(CHAT_SERVICE_FIREBASE_URL);
    var users = $firebaseArray(firebaseRef.child('users'));

    var User = {
        all: users,
        create: function(userId, userInfo) {
            return firebaseRef.child('users').child(userId).set({
                username: userInfo.username,
                conversations: []
            });
        },
        get: function(userId) {
            return $firebaseObject(firebaseRef.child('users').child(userId));
        }
    };

    return {
        User: User
    };
}]);