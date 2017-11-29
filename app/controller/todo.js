app.controller('TodoListController', function ($scope, $http, users, dataFactory) {
    var todoList = this;

    $scope.remainingTodos = 0;
    $scope.user = "guest";
    $scope.selectedUser = $scope.user;
    $scope.priority = "low";
    $scope.priority_order = "3";
    $scope.label = "info";
    $scope.showTodos = true;

    $scope.setUser = function (user) {
        $scope.user = user;
        $scope.showArchives = false;
        $scope.showTodos = false;
        $scope.setHash(user);
        $scope.selectedUser = user;

        var userKeys = users.userData.keys;

        for (key in userKeys) {
            if (key == user) {
                $scope.getUser(userKeys[key]);
            }
        }
    };

    $scope.getUser = function (id) {
        users.getUser(id)
            .then(function mySuccess(response) {
                $scope.userSetup(angular.fromJson(response.data));
            }, function myError(response) {
                console.log("there was an error: " + response.status);
            });
    };

    $scope.updateUser = function (id, data) {
        users.updateUser(id, data)
            .then(function mySuccess(response) {
                $scope.userSetup(angular.fromJson(response.data));
            }, function myError(response) {
                console.log("there was an error: " + response.status);
            });
    };

    $scope.userSetup = function (response) {
        $scope.todos_data = response;
        $scope.remaining();

        $scope.showTodos = true;

        if ($scope.todos_data.deadTodos.length > 0) {
            $scope.showArchives = true;
        }
    };

    $scope.setPriority = function (level, label, order) {
        $scope.priority = level;
        $scope.label = label;
        $scope.priority_order = order;
    };

    $scope.setHash = function (hash) {
        window.location.hash = hash;
    };

    function getObjectKeyIndex(obj, keyToFind) {
        var i = 0;

        for (key in obj) {
            if (obj[key].text == keyToFind) {
                return i;
            }
            i++;
        }

        return null;
    }

    //page load data load
    if (window.location.hash != '') {
        $scope.hashValue = window.location.hash.substring(1);
        $scope.setUser($scope.hashValue);
        $scope.selectedUser = $scope.hashValue;
    } else {
        $scope.getUser(users.userID($scope.user));
    }

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos_data.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archiveSelected = function () {
        var currentTodos = $scope.todos_data.todos;
        var temp = [];
        angular.forEach(currentTodos, function (todo) {
            if (!todo.done) {
                temp.push(todo);
            } else {
                $scope.showArchives = true;
                $scope.todos_data.deadTodos.push(todo);
            }
        });

        $scope.todos_data.todos = temp;
        $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
    };

    $scope.deleteSelected = function () {
        var currentTodos = $scope.todos_data.todos;
        var temp = [];
        angular.forEach(currentTodos, function (todo) {
            if (!todo.done) {
                temp.push(todo);
            } 
        });

        $scope.todos_data.todos = temp;
        $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
    };

    $scope.clear = function (data) {
        var ok = confirm(data + " WILL BE PERMENTLY DELETED.");

        if (ok) {
            switch (data) {
                case "todos":
                    $scope.todos_data.todos = [];
                    $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
                    break;
                case "deadTodos":
                    $scope.todos_data.deadTodos = [];
                    $scope.showArchives = false;
                    $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
                    break;
                case "everything":
                    $scope.todos_data.todos = [];
                    $scope.todos_data.deadTodos = [];
                    $scope.showArchives = false;
                    $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
                    break;
            }
        }
    };


    $scope.manageTodo = {		
        add: function () {
            var newTodo = { text: $scope.todoText, done: false, priority: $scope.priority, label: $scope.label, priority_order: $scope.priority_order };
            $scope.todos_data.todos.push(newTodo);
            $scope.todoText = '';

            $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
        },
        edit: function (todo) {
            dataFactory.editTodo(todo);
        },
        save: function (todo) {
            dataFactory.saveTodo(todo);
            $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
        },
        cancel: function (todo) {
            dataFactory.cancelEdit(todo);
        },
        remove: function (todo) {
            var todoIndex = getObjectKeyIndex($scope.todos_data.todos, todo.text);

            var ok = confirm("ARE YOU SURE? YOU CAN'T GET IT BACK ONCE YOU DELETE IT.");

            if (ok) {
                $scope.todos_data.todos.splice(todoIndex, 1);
                $scope.updateUser(users.userID($scope.user), angular.toJson($scope.todos_data));
            }
        },
        updatePriority: function (todo, priority) {
            dataFactory.updatePriority(todo, priority);
        }
    };
});
