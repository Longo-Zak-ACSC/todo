// set users
app.factory("User", function ($http) {
    // Define the setUser function
    var TodoUser = function (user) {
        // Define the initialize function
        this.initialize = function () {
            var url = '';
            var userData = $http.jsonp(url);
            var self = this;

            userData.then(function (response) {
                angular.extend(self, response.data);
            });
        };

        // Call the initialize function for every new instance
        this.initialize();
    };

    // Return a reference to the function
    return ();
});