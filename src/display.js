import { calendar, handleDeleteProject, handleDeleteTask } from ".";
import { Storage } from "./storage";

// Tasks
export function displayTask(task) {
  let taskContainer = document.createElement("div");
  taskContainer.classList.add("taskContainer");
  taskContainer.setAttribute("data-key", task.id);

  var newTitle = document.createElement("div");
  newTitle.innerHTML = task.title;
  newTitle.classList.add("listName");
  var newDueDate = document.createElement("div");

  if (task.dueDate === calendar.today) {
    newDueDate.innerHTML = "today";
  } else if (task.dueDate === calendar.tomorrow) {
    newDueDate.innerHTML = "tomorrow";
  } else {
    newDueDate.innerHTML = task.dueDate;
  }

  newDueDate.classList.add("listDue");

  if (task.priority === "low") {
    newTitle.style.color = "blue";
  }
  if (task.priority === "high") {
    newTitle.style.color = "red";
  }

  var edit = document.createElement("div");
  edit.classList.add("edit");
  edit.innerHTML = "...";

  var remove = document.createElement("button");
  remove.classList.add("deleteBtn");
  remove.classList.add("hide");
  remove.onclick = handleDeleteTask;
  remove.innerHTML = "x";

  taskContainer.append(newTitle, newDueDate, edit, remove);
  taskContainer.onmouseenter = showDeleteBtn;
  taskContainer.onmouseleave = hideDeleteBtn;
  content.append(taskContainer);
}

export function displayAllTasks() {
  let tasks = Object.values(Storage.myToDoList.allTasks);
  tasks.sort(function (x, y) {
    return x.timestamp - y.timestamp;
  });
  tasks.forEach((task) => {
    displayTask(task);
  });
}

export function removeTaskFromDisplay(id) {
  let divs = document.querySelectorAll("[data-key]");
  divs.forEach((div) => {
    if (div.getAttribute("data-key") === id) {
      div.remove();
    }
  });
}

function displayTodaysTasks() {
  let tasks = Object.values(Storage.myToDoList.allTasks);
  tasks.sort(function (x, y) {
    return x.timestamp - y.timestamp;
  });
  tasks.forEach((task) => {
    if (task.dueDate === calendar.today) {
      displayTask(task);
    }
  });
}

function displayTomorrowsTasks() {
  let tasks = Object.values(Storage.myToDoList.allTasks);
  tasks.sort(function (x, y) {
    return x.timestamp - y.timestamp;
  });
  tasks.forEach((task) => {
    if (task.dueDate === calendar.tomorrow) {
      displayTask(task);
    }
  });
}

function displayImportantTasks() {
  let tasks = Object.values(Storage.myToDoList.allTasks);
  tasks.sort(function (x, y) {
    return x.timestamp - y.timestamp;
  });
  tasks.forEach((task) => {
    if (task.priority === "high") {
      displayTask(task);
    }
  });
}

// PROJECTS
export function displayProjectTasks(projName) {
  let tasks = Object.values(Storage.myToDoList[projName]);
  tasks.forEach((el) => {
    displayTask(el);
  })
}

export function displayAllProjectButtons() {
  Object.keys(Storage.myToDoList).forEach((key) => {
    if (key !== "allTasks") {
      addProjectButton(key);
    }
  });
}

export function addProjectButton(projName) {
  var navBar = document.querySelector(".navBar");
  var projectBtnContainer = document.createElement("div");
  projectBtnContainer.classList.add("projectTab");
  projectBtnContainer.classList.add("navItem");
  projectBtnContainer.innerHTML = projName;
  var deleteBtn = document.createElement("div");
  deleteBtn.innerHTML = "x";
  deleteBtn.classList.add("deleteProject");
  deleteBtn.classList.add("disappear");
  deleteBtn.onclick = handleDeleteProject;

  projectBtnContainer.onmouseenter = showDeleteProjBtn;
  projectBtnContainer.onmouseleave = hideDeleteProjBtn;

  projectBtnContainer.append(deleteBtn);
  navBar.appendChild(projectBtnContainer);

  return projectBtnContainer;
}

const deleteProjectButton = () => {};

// Display selected navigation page.
export function togglePage(navBar) {
  console.log(navBar.innerHTML);
  content.innerHTML = "";
  let navItems = document.querySelectorAll(".navItem");
  navItems.forEach((el) => {
    el.classList.remove("active");
  });

  if (navBar.innerHTML === "home") {
    navBar.classList.add("active");

    var head = document.createElement("div");
    head.classList.add("navBarHead");
    var title = document.createElement("div");
    title.classList.add("navBarTitle");
    var subHead = document.createElement("div");
    subHead.classList.add("subHead");
    title.innerHTML = "Home";
    subHead.innerHTML = calendar.today;
    var addBtn = document.createElement("button");
    addBtn.innerHTML = "+";
    addBtn.classList.add("addBtns");
    addBtn.onclick = openMainForm;

    head.append(title, subHead, addBtn);
    content.appendChild(head);

    displayTaskHeader();
    displayAllTasks();
  } else if (navBar.innerHTML === "today") {
    var head = document.createElement("div");
    head.classList.add("navBarHead");
    var title = document.createElement("div");
    title.classList.add("navBarTitle");
    var subHead = document.createElement("div");
    subHead.classList.add("subHead");
    title.innerHTML = "Today";
    subHead.innerHTML = calendar.today;

    head.append(title, subHead);
    document.querySelector(".content").appendChild(head);

    displayTaskHeader();
    displayTodaysTasks();
  } else if (navBar.innerHTML === "tomorrow") {
    var head = document.createElement("div");
    head.classList.add("navBarHead");
    var title = document.createElement("div");
    title.classList.add("navBarTitle");
    var subHead = document.createElement("div");
    subHead.classList.add("subHead");
    title.innerHTML = "Tomorrow";
    subHead.innerHTML = calendar.tomorrow;

    head.append(title, subHead);
    document.querySelector(".content").appendChild(head);

    displayTaskHeader();
    displayTomorrowsTasks();
  } else if (navBar.innerHTML === "important tasks") {
    var title = document.createElement("div");
    title.classList.add("navBarTitle");
    title.innerHTML = "Urgent Tasks";

    document.querySelector(".content").appendChild(title);

    displayTaskHeader();
    displayImportantTasks();
  } else {
    navBar.classList.add("active");
    let projectTitle = navBar.childNodes[0].data;

    var head = document.createElement("div");
    head.classList.add("navBarHead");
    var title = document.createElement("div");
    title.classList.add("navBarTitle");
    var subHead = document.createElement("div");
    subHead.classList.add("subHead");
    title.innerHTML = projectTitle;
    subHead.innerHTML = calendar.today;
    var addBtn = document.createElement("button");
    addBtn.innerHTML = "+";
    addBtn.classList.add("addBtns");
    addBtn.onclick = openMainForm;

    head.append(title, subHead, addBtn);
    document.querySelector(".content").appendChild(head);

    displayTaskHeader();
    displayProjectTasks(projectTitle);
  }
}

export function displayTaskHeader() {
  let headerContainer = document.createElement("div");
  headerContainer.classList.add("flex");

  var nameHeader = document.createElement("div");
  nameHeader.innerHTML = "task";
  nameHeader.classList.add("listName");
  nameHeader.setAttribute("id", "taskHeader");
  var dueHead = document.createElement("div");
  dueHead.innerHTML = "due";
  dueHead.classList.add("listDue");
  dueHead.setAttribute("id", "dateHeader");

  headerContainer.append(nameHeader, dueHead);
  content.append(headerContainer);
}

// BUTTONS
function showDeleteBtn(e) {
  e.target.querySelector(".deleteBtn").classList.toggle("hide");
}

function hideDeleteBtn(e) {
  e.target.querySelector(".deleteBtn").classList.toggle("hide");
}

function showDeleteProjBtn(e) {
  e.target.querySelector(".deleteProject").classList.toggle("disappear");
}

function hideDeleteProjBtn(e) {
  e.target.querySelector(".deleteProject").classList.toggle("disappear");
}

// FORMS
let formMain = document.querySelector(".formMain");
let editForm = document.querySelector(".editForm");
let content = document.querySelector(".content");
let mainFormContainer = document.getElementById("formDiv");

export function openEditForm() {
  closeMainForm();
  editForm.style.display = "grid";
  document.querySelector("#cancelEdit").style.display = "block";
}

export function closeEditForm() {
  editForm.reset();
  editForm.style.display = "none";
  document.querySelector("#cancelEdit").style.display = "none";
}

export function openMainForm() {
  mainFormContainer.classList.toggle("hide");
}

export function closeMainForm() {
  formMain.reset();
  mainFormContainer.classList.toggle("hide");
}

export function toggleProjectForm() {
  document.getElementById("addProjectDiv").classList.toggle("hide");
}
