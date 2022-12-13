
import { sub } from "date-fns";
import { calendar } from ".";
import { Storage } from "./storage";

const formDisplay = (() => {
    const openEditForm = () => {
        closeMainForm();
        document.querySelector('.editForm').style.display = "grid";
        document.querySelector('#cancelEdit').style.display = "block";
    }

    const closeEditForm = () => {
        document.querySelector('.editForm').reset();
        document.querySelector('.editForm').style.display = "none";
        document.querySelector('#cancelEdit').style.display = "none";
    };

    const openMainForm = () => {
        closeEditForm();
        document.querySelector('.formMain').style.display = "grid";
        document.querySelector('#cancelMain').style.display = "block";
    };

    const closeMainForm = () => {
        document.querySelector('.formMain').reset();
        document.querySelector('.formMain').style.display = "none";
        document.querySelector('#cancelMain').style.display = "none";
    };
    return {openEditForm, closeEditForm, openMainForm, closeMainForm};
})();

const todoDisplay = (() => {
    var content = document.querySelector('.content');

    function displayNewTodo(title, dueDate, priority) {
        var newTitle = document.createElement('div');
        newTitle.innerHTML = title;
        newTitle.classList.add('listName');
        var newDueDate = document.createElement('div');

        if (dueDate === calendar.today) {newDueDate.innerHTML = "today"}
        else if (dueDate === calendar.tomorrow) {newDueDate.innerHTML = "tomorrow"}
        else {newDueDate.innerHTML = dueDate};
    
        newDueDate.classList.add('listDue');
        
        if (priority === 'low') { newTitle.style.color = "blue" };
        if (priority === 'high') { newTitle.style.color = "red" };

        var edit = document.createElement('div');
        edit.classList.add('edit');
        edit.innerHTML = "...";

        content.append(newTitle, newDueDate, edit);
        return {displayNewTodo};
    };

    function appendTaskHeader() {
        var nameHeader = document.createElement('div');
        nameHeader.innerHTML = "task";
        nameHeader.classList.add('listName');
        nameHeader.setAttribute('id', 'taskHeader');
        var dueHead = document.createElement('div');
        dueHead.innerHTML = "due";
        dueHead.classList.add('listDue');
        dueHead.setAttribute('id', 'dateHeader')

        content.append(nameHeader, dueHead);
    };

    function updateDisplay(todo, index) {
        var titleDivs = document.querySelectorAll(".listName");
        titleDivs[index+1].innerHTML = todo.title;
        var dueDateDivs = document.querySelectorAll(".listDue");
        dueDateDivs[index+1].innerHTML = todo.dueDate;
    };

    function removeDisplay(index) {
        var titleDivs = document.querySelectorAll(".listName");
        titleDivs[index+1].remove();
        var dueDateDivs = document.querySelectorAll(".listDue");
        dueDateDivs[index+1].remove();
        var editDivs = Array.from(document.querySelectorAll('.edit'));
        editDivs[index].remove();

        formDisplay.closeEditForm();
        
    };

    return { displayNewTodo, appendTaskHeader, updateDisplay, removeDisplay }
})();

const projectDisplay = (() => {
    let projectNames = ["main"];

    if (!(window.localStorage.getItem("projectNames") === null)) {
        var names = Storage().names();
        projectNames = names;
    } else {Storage().storeNames(projectNames)};

    const getName = () => {
        var promptName = prompt('what is your new project name?', 'project');
        projectNames.push(promptName);
        console.log(projectNames);
        Storage().storeNames(projectNames);
        displayNewProject(promptName);
    };

    const displayNewProject = (promptName) =>{


        var navBar = document.querySelector('.navBar');
        var newProjectTab = document.createElement('div');
        newProjectTab.classList.add('projectTab');

        var deleteBtn = document.createElement('div');
        deleteBtn.innerHTML = "x";
        deleteBtn.classList.add('deleteProject');
        var name = document.createElement('div');
        name.innerHTML = promptName;

        newProjectTab.append(name, deleteBtn);


        navBar.appendChild(newProjectTab);

    };

    // selects title and dueDate for all to-do items in current project
    const displayCurrentProject = (index, allProjects) => {
        var content = document.querySelector('.content')
        content.innerHTML = "";

        todoDisplay.appendTaskHeader(index);
        for (var i=0; i < allProjects[index].length; i++) {
            var title = allProjects[index][i].title;
            var dueDate = allProjects[index][i].dueDate;
            var priority = allProjects[index][i].priority;
            todoDisplay.displayNewTodo( title, dueDate, priority );

        };
    
    };

    const displayAllProjects = () => {
        var allProjects = Storage().project();
        for (let i=1; i < allProjects.length; i++) {
            var names = Storage().names();
            displayNewProject(names[i]);
        };
    };

    const removeProject = (index) => {
        var projects = document.querySelectorAll('.projectTab');
        projects[index].remove();

    };

    return {getName, displayNewProject, displayCurrentProject, displayAllProjects, removeProject};
})();

const navBarDisplay = (() => {
    
    const todayHeader = (today) => {
        document.querySelector('.content').innerHTML = "";

        var head = document.createElement('div');
        head.classList.add('navBarHead');
        var title = document.createElement('div');
        title.classList.add('navBarTitle');
        var subHead = document.createElement('div');
        subHead.classList.add('subHead');
        title.innerHTML = "Today"
        subHead.innerHTML = today;
    
        head.append(title, subHead);
        document.querySelector('.content').appendChild(head);
    };

    const tomorrowHeader = (tomorrow) => {
        document.querySelector('.content').innerHTML = "";

        var head = document.createElement('div');
        head.classList.add('navBarHead');
        var title = document.createElement('div');
        title.classList.add('navBarTitle');
        var subHead = document.createElement('div');
        subHead.classList.add('subHead');
        title.innerHTML = "Tomorrow"
        subHead.innerHTML = tomorrow;
    
        head.append(title, subHead);
        document.querySelector('.content').appendChild(head);
    };

    const importantHeader = () => {
        document.querySelector('.content').innerHTML = "";

        var title = document.createElement('div');
        title.classList.add('navBarTitle');
        title.innerHTML = "Urgent Tasks"
    
        document.querySelector('.content').appendChild(title);
    };

    return { todayHeader, tomorrowHeader, importantHeader };
})();

export { todoDisplay, projectDisplay, formDisplay, navBarDisplay };

