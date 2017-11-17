app.controller('TodoListController', function ($scope, $http, dataService) {
    var todoList = this;

    $scope.data_url = "https://api.myjson.com/bins/16ez9b";
    $scope.remainingTodos = 0;
    $scope.user_data_ID = { "mom": "79i8j", "pappa": "12thar", "jules": "9n8nn", "celia": "s3oer", "guest": "16ez9b"};
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

        for (key in $scope.user_data_ID) {
            if (key == user) {
                $scope.data_url = "https://api.myjson.com/bins/" + $scope.user_data_ID[key];
                httpRequest("GET", $scope.data_url, null);
                $scope.setHash(user);
                $scope.selectedUser = user;
            }
        }
    };

    $scope.setPriority = function (value) {
        $scope.priority = value;

        switch (value) {
            case "low":
                $scope.label = "info";
                $scope.priority_order = "3";
                break;
            case "medium":
                $scope.label = "warning";
                $scope.priority_order = "2";
                break;
            case "high":
                $scope.label = "danger";
                $scope.priority_order = "1";
                break;
        }
    };

    $scope.setHash = function (hash) {
        window.location.hash = hash;
    };

    function httpRequest(type, url, data) {
        $http({
            method: type,
            url: url,
            data: data
        }).then(function mySuccess(response) {
            $scope.todos_data = angular.fromJson(response.data);
            $scope.remaining();

            $scope.showTodos = true;

            if ($scope.todos_data.deadTodos.length > 0) {
                $scope.showArchives = true;
            }
        }, function myError(response) {
            console.log("there was an error: " + response.status);
        });
    }

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

    //Initial data load
    httpRequest("GET", $scope.data_url, null);

    if (window.location.hash != '') {
        $scope.hashValue = window.location.hash.substring(1);
        $scope.setUser($scope.hashValue);
        $scope.selectedUser = $scope.hashValue;
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
        httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
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
        httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
    };

    $scope.clear = function (data) {
        var ok = confirm(data + " WILL BE PERMENTLY DELETED.");

        if (ok) {
            switch (data) {
                case "todos":
                    $scope.todos_data.todos = [];
                    httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
                    break;
                case "deadTodos":
                    $scope.todos_data.deadTodos = [];
                    $scope.showArchives = false;
                    httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
                    break;
                case "everything":
                    $scope.todos_data.todos = [];
                    $scope.todos_data.deadTodos = [];
                    $scope.showArchives = false;
                    httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
                    break;
            }
        }
    };


    $scope.manageTodo = {		
        add: function () {
            var newTodo = { text: $scope.todoText, done: false, priority: $scope.priority, label: $scope.label, priority_order: $scope.priority_order };
            $scope.todos_data.todos.push(newTodo);
            $scope.todoText = '';

            httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
        },
        edit: function (todo) {
            todo['editing'] = true;
            todo['edit_text'] = todo.text;
            todo['edit_label'] = todo.label;
            todo['edit_priority'] = todo.priority;
            todo['edit_priority_order'] = todo.priority_order;
        },
        save: function (todo) {
            todo['editing'] = false;
            todo.text = todo.edit_text;
            todo.label = todo.edit_label;
            todo.priority = todo.edit_priority;
            todo.priority_order = todo.edit_priority_order;
            delete todo['editing'];
            delete todo['edit_text'];
            delete todo['edit_label'];
            delete todo['edit_priority'];
            delete todo['edit_priority_order'];
            httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
        },
        cancel: function (todo) {
            todo['editing'] = false;
            delete todo['editing'];
            delete todo['edit_text'];
            delete todo['edit_label'];
            delete todo['edit_priority'];
            delete todo['edit_priority_order'];
        },
        remove: function (todo) {
            var todoIndex = getObjectKeyIndex($scope.todos_data.todos, todo.text);

            var ok = confirm("ARE YOU SURE? YOU CAN'T GET IT BACK ONCE YOU DELETE IT.");

            if (ok) {
                $scope.todos_data.todos.splice(todoIndex, 1);
                httpRequest("PUT", $scope.data_url, angular.toJson($scope.todos_data));
            }
        },
        updatePriority: function (todo, priority) {
            todo.edit_priority = priority;

            switch (priority) {
                case "low":
                    todo.edit_priority_order = "3";
                    todo.edit_label = "info";
                    break;
                case "medium":
                    todo.edit_priority_order = "2";
                    todo.edit_label = "warning";
                    break;
                case "high":
                    todo.edit_priority_order = "1";
                    todo.edit_label = "danger";
                    break;
            }                
        }
    };
});
