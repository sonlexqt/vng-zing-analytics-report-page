var servicesModule = angular.module('zaApp.Services', []);

var CHAT_SERVICE_FIREBASE_URL = 'https://za-report-chat.firebaseio.com/';

servicesModule.factory('ChatService', ['$rootScope', '$firebaseArray', '$firebaseObject', function($rootScope, $firebaseArray, $firebaseObject) {
    var firebaseRef = new Firebase(CHAT_SERVICE_FIREBASE_URL);

    var Conversation = {
        create: function(thisUsername, thatUsername){
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            $firebaseArray(firebaseRef.child('users').child(thisUsername).child('conversations').child(thatUsername)).$add({
                msg: "Connection established",
                timestamp: timestamp,
                sender: thisUsername,
                receiver: thatUsername
            });
            $firebaseArray(firebaseRef.child('users').child(thatUsername).child('conversations').child(thisUsername)).$add({
                msg: "Connection established",
                timestamp: timestamp,
                sender: thisUsername,
                receiver: thatUsername
            });
        },
        getConversationWithThatUser: function(thisUsername, thatUsername){
            return $firebaseArray(firebaseRef.child('users').child(thisUsername).child('conversations').child(thatUsername));
        },
        addMessage: function(thisUsername, thatUsername, message){
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            $firebaseArray(firebaseRef.child('users').child(thisUsername).child('conversations').child(thatUsername)).$add({
                msg: message,
                timestamp: timestamp,
                sender: thisUsername,
                receiver: thatUsername
            });
            $firebaseArray(firebaseRef.child('users').child(thatUsername).child('conversations').child(thisUsername)).$add({
                msg: message,
                timestamp: timestamp,
                sender: thisUsername,
                receiver: thatUsername
            });
        }
    };

    var Message = {
        getMessage: function(thisUsername, thatUsername, messageId){
            return $firebaseObject(firebaseRef.child('users').child(thisUsername).child('conversations').child(thatUsername).child(messageId));
        }
    };

    return {
        Conversation: Conversation,
        Message: Message
    };
}]);