angular.module('todoApp')
    .service('users', ['$http', function ($http) {

        var user_keys = { "mom": "79i8j", "pappa": "12thar", "jules": "9n8nn", "celia": "s3oer", "guest": "16ez9b" };
        var url_base = 'https://api.myjson.com/bins/';

        this.getUser = function (id) {
            return $http.get(url_base + id);
        };

        this.updateUser = function (id, data) {
            return $http.put(url_base + id, data);
        };

        this.userID = function (user) {
            for (key in user_keys) {
                if (key == user) {
                    return user_keys[key];
                }
            }
        };

        this.userData = {
            keys: user_keys,
            url: url_base
        };
    }]);