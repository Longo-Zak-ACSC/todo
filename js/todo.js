angular.module('todoApp', [])
    .controller('TodoListController', function ($scope, $http) {
        var todoList = this;

        todoList.data_url = "https://api.myjson.com/bins/16ez9b";
        todoList.remainingTodos = 0;
        todoList.user = "guest";
        todoList.selectedUser = todoList.user;
        todoList.priority = "low";
        todoList.priority_order = "3";
        todoList.label = "info";
        todoList.showTodos = true;

        todoList.setUser = function (user) {
            todoList.user = user;
            todoList.showArchives = false;
            todoList.showTodos = false;

            switch (user.toLowerCase()) {
                case "mom":
                    todoList.data_url = "https://api.myjson.com/bins/79i8j";
                    todoList.setUserUtils(todoList.data_url, user);
                    break;
                case "pappa":
                    todoList.data_url = "https://api.myjson.com/bins/12thar";
                    todoList.setUserUtils(todoList.data_url, user);
                    break;
                case "jules":
                    todoList.data_url = "https://api.myjson.com/bins/9n8nn";
                    todoList.setUserUtils(todoList.data_url, user);
                    break;
                case "celia":
                    todoList.data_url = "https://api.myjson.com/bins/s3oer";
                    todoList.setUserUtils(todoList.data_url, user);
                    break;
                case "guest":
                    todoList.data_url = "https://api.myjson.com/bins/16ez9b";
                    todoList.setUserUtils(todoList.data_url, user);
                    break;
                default:
                    todoList.data_url = "https://api.myjson.com/bins/16ez9b";
                    todoList.setUserUtils(todoList.data_url, 'guest');
                    break;
            }
        };

        todoList.setPriority = function (value) {
            todoList.priority = value;

            switch (value) {
                case "low":
                    todoList.label = "info";
                    todoList.priority_order = "3";
                    break;
                case "medium":
                    todoList.label = "warning";
                    todoList.priority_order = "2";
                    break;
                case "high":
                    todoList.label = "danger";
                    todoList.priority_order = "1";
                    break;
            }
        };

        todoList.setUserUtils = function (data_url, user) {
            httpRequest("GET", data_url, null);
            todoList.setHash(user);
            todoList.selectedUser = user;
        };

        todoList.setHash = function (hash) {
            window.location.hash = hash;
        };

        function httpRequest(type, url, data) {
            $http({
                method: type,
                url: url,
                data: data
            }).then(function mySuccess(response) {
                todoList.todos_data = angular.fromJson(response.data);
                todoList.remaining();

                todoList.showTodos = true;

                if (todoList.todos_data.deadTodos.length > 0) {
                    todoList.showArchives = true;
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
        httpRequest("GET", todoList.data_url, null);

        if (window.location.hash != '') {
            todoList.hashValue = window.location.hash.substring(1);
            todoList.setUser(todoList.hashValue);
            todoList.selectedUser = todoList.hashValue;
        }

        todoList.remaining = function () {
            var count = 0;
            angular.forEach(todoList.todos_data.todos, function (todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        todoList.archiveSelected = function () {
            var currentTodos = todoList.todos_data.todos;
            var temp = [];
            angular.forEach(currentTodos, function (todo) {
                if (!todo.done) {
                    temp.push(todo);
                } else {
                    todoList.showArchives = true;
                    todoList.todos_data.deadTodos.push(todo);
                }
            });

            todoList.todos_data.todos = temp;
            httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
        };

        todoList.deleteSelected = function () {
            var currentTodos = todoList.todos_data.todos;
            var temp = [];
            angular.forEach(currentTodos, function (todo) {
                if (!todo.done) {
                    temp.push(todo);
                } 
            });

            todoList.todos_data.todos = temp;
            httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
        };

        todoList.clear = function (data) {
            var ok = confirm(data + " WILL BE PERMENTLY DELETED.");

            if (ok) {
                switch (data) {
                    case "todos":
                        todoList.todos_data.todos = [];
                        httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
                        break;
                    case "deadTodos":
                        todoList.todos_data.deadTodos = [];
                        todoList.showArchives = false;
                        httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
                        break;
                    case "everything":
                        todoList.todos_data.todos = [];
                        todoList.todos_data.deadTodos = [];
                        todoList.showArchives = false;
                        httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
                        break;
                }
            }
        };


        todoList.manageTodo = {		
            add: function () {
                var newTodo = { text: todoList.todoText, done: false, priority: todoList.priority, label: todoList.label, priority_order: todoList.priority_order };
                todoList.todos_data.todos.push(newTodo);
                todoList.todoText = '';

                httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
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
                httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
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
                var todoIndex = getObjectKeyIndex(todoList.todos_data.todos, todo.text);

                var ok = confirm("ARE YOU SURE? YOU CAN'T GET IT BACK ONCE YOU DELETE IT.");

                if (ok) {
                    todoList.todos_data.todos.splice(todoIndex, 1);
                    httpRequest("PUT", todoList.data_url, angular.toJson(todoList.todos_data));
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
