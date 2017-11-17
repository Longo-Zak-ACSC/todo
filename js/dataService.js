angular.module('todoApp')
    .service('dataService', ['$http', function ($http) {

        var urlBase = 'https://api.myjson.com/bins/';

        this.getUser = function (id) {
            return $http.get(urlBase + id);
        };

        this.updateUser = function (id, data) {
            return $http.post(urlBase + id, data);
        };

    }]);