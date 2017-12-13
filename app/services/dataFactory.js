angular.module('todoApp')
    .service('dataFactory', ['$http', function ($http) {

        var editTodo = function (todo) {
            todo['editing'] = true;
            todo['edit_text'] = todo.text;
            todo['edit_label'] = todo.label;
            todo['edit_priority'] = todo.priority;
            todo['edit_priority_order'] = todo.priority_order;
        };

        var saveTodo = function (todo) {
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
        };

        var cancelEdit = function (todo) {
            todo['editing'] = false;
            delete todo['editing'];
            delete todo['edit_text'];
            delete todo['edit_label'];
            delete todo['edit_priority'];
            delete todo['edit_priority_order'];
        };

        var updatePriority = function (todo, priority) {
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
        };

        var getObjectKeyIndex = function (obj, keyToFind) {
            var i = 0;

            for (key in obj) {
                if (obj[key].text == keyToFind) {
                    return i;
                }
                i++;
            }

            return null;
        };

        return {
            editTodo: editTodo,
            saveTodo: saveTodo,
            cancelEdit: cancelEdit,
            updatePriority: updatePriority,
            getObjectKeyIndex: getObjectKeyIndex
        }; 

    }]);