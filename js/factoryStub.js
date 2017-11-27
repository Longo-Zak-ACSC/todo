//angular.module('todoApp')
//    .service('dataFactory', ['$http', function ($http) {

//        //var path = 'data/people/students.json';
//        //var students = [];
//        //var dataFactory = {};

//        //dataFactory.getCustomers = function () {
//        //    return $http.get(urlBase);
//        //};

//        //dataFactory.getCustomer = function (id) {
//        //    return $http.get(urlBase + '/' + id);
//        //};

//        //var save = function (student) {
//        //    if (student.id === null) {
//        //        students.push(student);
//        //    } else {
//        //        for (var i = 0; i < students.length; i++) {
//        //            if (students[i].id === student.id) {
//        //                students[i] = student;
//        //                break;
//        //            }
//        //        }
//        //    }
//        //};

//        var editTodo = function (todo) {
//            todo['editing'] = true;
//            todo['edit_text'] = todo.text;
//            todo['edit_label'] = todo.label;
//            todo['edit_priority'] = todo.priority;
//            todo['edit_priority_order'] = todo.priority_order;
//        };

//        var saveTodo = function (todo) {
//            todo['editing'] = false;
//            todo.text = todo.edit_text;
//            todo.label = todo.edit_label;
//            todo.priority = todo.edit_priority;
//            todo.priority_order = todo.edit_priority_order;
//            delete todo['editing'];
//            delete todo['edit_text'];
//            delete todo['edit_label'];
//            delete todo['edit_priority'];
//            delete todo['edit_priority_order'];
//        };

//        var cancelEdit = function (todo) {
//            todo['editing'] = false;
//            delete todo['editing'];
//            delete todo['edit_text'];
//            delete todo['edit_label'];
//            delete todo['edit_priority'];
//            delete todo['edit_priority_order'];
//        };

//        var updatePriority = function (todo, priority) {
//            todo.edit_priority = priority;

//            switch (priority) {
//                case "low":
//                    todo.edit_priority_order = "3";
//                    todo.edit_label = "info";
//                    break;
//                case "medium":
//                    todo.edit_priority_order = "2";
//                    todo.edit_label = "warning";
//                    break;
//                case "high":
//                    todo.edit_priority_order = "1";
//                    todo.edit_label = "danger";
//                    break;
//            }
//        };

//        ///* Populate the students array with students from the server */
//        //$http.get(path).success(function (data) {
//        //    data.forEach(function (student) {
//        //        students.push(student);
//        //    });
//        //});

//        return {
//            editTodo: editTodo,
//            saveTodo: saveTodo,
//            cancelEdit: cancelEdit,
//            updatePriority: updatePriority
//        };


//        //return dataFactory;

//    }]);