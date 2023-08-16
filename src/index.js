import { Storage } from "./storage";
import Todo from "./ToDo";
import "./style.css";
import {
  addProjectButton,
  closeEditForm,
  closeMainForm,
  displayAllProjectButtons,
  displayTask,
  openEditForm,
  removeTaskFromDisplay,
  togglePage,
  toggleProjectForm,
} from "./display";
import flatpickr from "flatpickr";
import parse from "date-fns/parse";
import add from "date-fns/add";
import format from "date-fns/format";
import uniqid from "uniqid";

// date-fns & flatpickr calendar
export const calendar = (() => {
  flatpickr("#dueDate", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
  });
  flatpickr("#dueDateEdit", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
  });
  const today = format(new Date(), "MMM d, y");
  const tomorrowFn = add(new Date(), {
    days: 1,
  });
  const tomorrow = format(tomorrowFn, "MMM d, y");
  const parseDate = (formDate) => {
    var myParse = parse(formDate, "yyyy-MM-dd", new Date());
    var formatDate = format(myParse, "MMM d, y");
    return formatDate;
  };
  return { parseDate, today, tomorrow };
})();

const App = () => {
  // Create storage ref if new user.
  if (!Storage.myToDoList) {
    Storage.createStorage();
  }

  togglePage(document.getElementById("home"));
  displayAllProjectButtons();
};

let selectedProject = null;
let selectedTask = null;

App();

export function handleDeleteProject(e) {
  let div = e.target.parentElement;
  let project = e.target.previousSibling.data;
  console.log(project);

  // remove button
  div.remove();

  // delete tasks and project from storage
  Storage.removeProject(project);

  togglePage(document.getElementById("home"));
}

export function handleDeleteTask(e) {
  let id = e.target.parentElement.getAttribute("data-key");
  // delete from storage
  Storage.removeTask(id);
  // remove from display
  removeTaskFromDisplay(id);
}

export function handleOpenEditForm(e) {
  let id = e.target.parentElement.getAttribute("data-key");
  let task = Storage.myToDoList.allTasks[id];
  selectedTask = id;
  openEditForm();
  showTaskInEditForm(task);
  console.log(task);
}

export function handleEditSubmit(e) {
   e.preventDefault();
   let id = selectedTask;
   let timestamp = Storage.myToDoList.allTasks[id].timestamp;
   var title = document.getElementById("titleEdit").value;
   var description = document.getElementById("descriptionEdit").value;
   var dueDate = document.getElementById("dueDateEdit").value;
   var select = document.querySelector("#priorityEdit");
   var priority = select.options[select.selectedIndex].value;

   var formatDate = calendar.parseDate(dueDate);

   let task = new Todo(
     title,
     description,
     formatDate,
     priority,
     id,
     selectedProject,
     timestamp
   );

   Storage.addTask(task);
   updateTaskDiv(task);
   closeEditForm();
   selectedTask = null;
}

function updateTaskDiv(task) {
  let taskContainer;
  let id = task.id;
  let divs = document.querySelectorAll("[data-key]");
  divs.forEach((div) => {
    if (div.getAttribute("data-key") === id) {
      taskContainer = div;
    }
  });
  taskContainer.querySelector(".listName").innerHTML = task.title;
  taskContainer.querySelector(".listDue").innerHTML = task.dueDate;
}

function showTaskInEditForm(task) {
  let formTitle = document.getElementById('titleEdit');
  let formDescription = document.getElementById('descriptionEdit');
  let formDueDate = document.querySelectorAll('.form-control')[1];
  let formPriority = document.getElementById('priorityEdit');

  formTitle.value = task.title;
  formDescription = task.description;
  formDueDate.placeholder = task.dueDate;
  formPriority.value = task.priority;
}

// forms functionality
const submit = (e) => {
  e.preventDefault();
  let timestamp = Date.now();
  let id = uniqid() + timestamp;
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var dueDate = document.getElementById("dueDate").value;
  var select = document.querySelector("select");
  var priority = select.options[select.selectedIndex].value;
  var formatDate = calendar.parseDate(dueDate);

  let task = new Todo(
    title,
    description,
    formatDate,
    priority,
    id,
    selectedProject,
    timestamp
  );

  Storage.addTask(task);
  displayTask(task);
  closeMainForm();
};

function submitNewProject(e) {
  e.preventDefault();
  let project = document.getElementById("projectInput").value;

  Storage.addProject(project);
  togglePage(addProjectButton(project));
  toggleProjectForm();
}

// DOM elements and event listeners.
var formSubmitBtn = document.getElementById("mainSubmit");
formSubmitBtn.onclick = submit;
var editFormSubmitBtn = document.getElementById("editSubmit");
editFormSubmitBtn.onclick = handleEditSubmit;
var cancelMain = document.getElementById("cancelMain");
cancelMain.onclick = closeMainForm;
var cancelEdit = document.getElementById("cancelEdit");
cancelEdit.onclick = closeEditForm;
let newProjectBtn = document.getElementById("newProjectSubmitBtn");
newProjectBtn.onclick = submitNewProject;
let openProjectForm = document.getElementById("openNewProjectFormBtn");
openProjectForm.onclick = toggleProjectForm;

document.addEventListener(
  "click",
  function (e) {
    if (e.target.matches(".mainNav")) {
      selectedProject = null;
      togglePage(e.target);
    }
    if (e.target.matches(".projectTab")) {
      selectedProject = e.target.childNodes[0].data;
      togglePage(e.target);
    }
  },
  false
);
