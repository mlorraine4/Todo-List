import { todoDisplay, projectDisplay, formDisplay, navBarDisplay } from './display';
import { Storage } from './storage';
import './style.css';
import icon from "./images/home.png";
import icon2 from "./images/alert.png";
import icon3 from "./images/calendar.png";
import icon5 from "./images/mail.png";
import icon6 from "./images/notification.png";
import icon7 from "./images/scheduling.png";
import format from 'date-fns/format';   
import add from 'date-fns/add';
import parse from 'date-fns/parse';
import flatpickr from 'flatpickr';
// TODO: alert message if due date is empty!
// TODO: add functionality to edit main project button!

// date-fns & flatpickr calendar
const calendar = (() => {
    flatpickr("#dueDate", 
    {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
    flatpickr("#dueDateEdit", 
    {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
    const today = format(new Date(), "MMM d, y");
    const tomorrowFn = add(new Date(), {
        days: 1
    });
    const tomorrow = format(tomorrowFn, "MMM d, y");
    const parseDate = (formDate) => {
        var myParse = parse(formDate, 'yyyy-MM-dd', new Date());
        var formatDate = format(myParse, "MMM d, y");
        return formatDate;
    };
    return { parseDate, today, tomorrow };
})();


const Todo = function (title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;

    return { title, description, dueDate, priority };
};

const indexController = {
    project: 0,
    todo: 0
};

// project functions
const projectMain = (() => {

    var allProjects = [];
// first option for users who have saved to-do items, second for new users
    if (!(window.localStorage.getItem("myProjects") === null)) {
        var projects = Storage().project();
        allProjects = projects;
        projectDisplay.displayCurrentProject(indexController.project, projects);
        projectDisplay.displayAllProjects();
    } else {
        var defaultProject = [];
        var a = new Todo("paint", "living room", "Dec 12, 2022", "none");
        defaultProject.push(a);
        var b = new Todo("clean", "kitchen", "Dec 13, 2022", "high");
        defaultProject.push(b);

        allProjects.push(defaultProject);
        projectDisplay.displayCurrentProject(indexController.project, allProjects);
        Storage(allProjects);
    };

    console.log(allProjects);
// when nav bar is clicked, finds index of selected project or deletes project
    document.addEventListener('click', function(e) {
        if (e.target.matches('.projectTab') ) {
    
            var projectNodeList = document.querySelectorAll('.projectTab');
            const projectTabArray = Array.from(projectNodeList);
            indexController.project = projectTabArray.indexOf(e.target);
            projectDisplay.displayCurrentProject(indexController.project, allProjects);
            
        }
        if (e.target.matches('.deleteProject')) {
            deleteProject(e.target);
        }
    }, false);

   // add proj to array that will store to do items
    function addProject() {
        var project = new Array;
        allProjects.push(project);
        Storage().save(allProjects);
    };

    // create project, display in navbar
    var addProjBtn = document.querySelector('#addProject');
    addProjBtn.addEventListener('click', projectDisplay.getName);
    addProjBtn.addEventListener('click', addProject );

    // add to-do item to current project
    function addListToProject ( newTodo ) {

        allProjects[indexController.project].push( newTodo );
        Storage().save(allProjects);
        
    };

    function deleteProject (target) {
        var projects = Array.from(document.querySelectorAll('.deleteProject'));
        var projectIndex = projects.indexOf(target) + 1;
        allProjects.splice(projectIndex, 1);
        Storage().save(allProjects);

        var names = Storage().names();
        names.splice(projectIndex, 1);
        Storage().storeNames(names);

        projectDisplay.removeProject(projectIndex);
        projectDisplay.displayCurrentProject(projectIndex-1, allProjects);

    };
    
    return { addProject, addListToProject, allProjects };
})();

//todo functions
const todoMain = (() => {
    var todoIndex = 0;
    
    document.addEventListener('click', function(e) {
        if (e.target.matches('.edit')) {
            formDisplay.openEditForm();
            var edit = e.target;
            updateTodoIndex(edit);
        };
    });
    
    function createTodo (title, description, dueDate, priority) {

        var newTodo = new Todo(title, description, dueDate, priority);
        projectMain.addListToProject( newTodo );
    
        todoDisplay.displayNewTodo(title, dueDate, priority);
        formDisplay.closeMainForm();
    
    };

    function updateTodoIndex(edit) {
        var editNodeList = document.querySelectorAll(".edit");
        var toDoItems = Array.from(editNodeList);
        todoIndex = toDoItems.indexOf(edit);
    };

    function updateToDo(title, description, dueDate, priority) {
        var project = projectMain.allProjects[indexController.project];
        var todo = project[todoIndex];
        todo.title = title;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.priority = priority;

        console.log(projectMain.allProjects);
        Storage().save(projectMain.allProjects);
        todoDisplay.updateDisplay(todo, todoIndex);
    };

    function deleteTodo() {
        console.log(indexController.project);
        projectMain.allProjects[indexController.project].splice(todoIndex, 1);
        Storage().save(projectMain.allProjects);
        todoDisplay.removeDisplay(todoIndex);
    };

    return { createTodo, updateToDo, deleteTodo };

})();

// forms functionality
const formMain = (() => {

    const submit = (e) => {
        // TODO: only allow submit when title input isn't empty
        e.preventDefault();
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var dueDate = document.getElementById('dueDate').value;
        var select = document.querySelector('select');
        var priority = select.options[select.selectedIndex].value;

        var formatDate = calendar.parseDate(dueDate);
        todoMain.createTodo (title, description, formatDate, priority); 

    };
    
    function editFormSubmit(e) {
        // TODO: only allow submit when title input isn't empty
        e.preventDefault();
        var title = document.getElementById('titleEdit').value;
        var description = document.getElementById('descriptionEdit').value;
        var dueDate = document.getElementById('dueDateEdit').value;
        var select = document.querySelector('#priorityEdit');
        var priority = select.options[select.selectedIndex].value;
        
        var formatDate = calendar.parseDate(dueDate);
        todoMain.updateToDo(title, description, formatDate, priority);
        formDisplay.closeEditForm();
    };

    var formSubmit = document.getElementById('mainSubmit');
    formSubmit.onclick = submit;
    var editForm = document.getElementById('editSubmit');
    editForm.onclick = editFormSubmit;
    var cancelMain = document.getElementById('cancelMain');
    cancelMain.onclick = formDisplay.closeMainForm;
    var cancelEdit = document.getElementById('cancelEdit');
    cancelEdit.onclick = formDisplay.closeEditForm;
    var deleteBtn = document.getElementById('delete');
    deleteBtn.addEventListener('click', todoMain.deleteTodo);
    var openMain = document.getElementById('openMainForm');
    openMain.onclick = formDisplay.openMainForm;
    
})();

// today, tomorrow, high priority navbar button controls
const navBar = (() => {

    document.querySelector('#today').addEventListener('click', function(){
        navBarDisplay.todayHeader(calendar.today);
        findTasks(calendar.today);
    });
    document.querySelector('#tomorrow').addEventListener('click', function(){
        navBarDisplay.tomorrowHeader(calendar.tomorrow);
        findTasks(calendar.tomorrow);
    });
    document.querySelector('#important').addEventListener('click', function(){
        navBarDisplay.importantHeader();
        findImportantTasks();
        
    });

    function findTasks(day) {
        for (var p=0; p < projectMain.allProjects.length; p++) {
            for (var i=0; i < projectMain.allProjects[p].length; i++) {
                if (projectMain.allProjects[p][i].dueDate === day) {
                    todoDisplay.displayNewTodo(projectMain.allProjects[p][i].title,"", projectMain.allProjects[p][i].priority);
                };
            };
        };
    };

    function findImportantTasks() {
        for (var p=0; p < projectMain.allProjects.length; p++) {
            for (var i=0; i < projectMain.allProjects[p].length; i++) {
                if (projectMain.allProjects[p][i].priority === "high") {
                    todoDisplay.displayNewTodo(projectMain.allProjects[p][i].title,projectMain.allProjects[p][i].dueDate, projectMain.allProjects[p][i].priority);
                };
            };
        };
    }

})();

export {calendar};