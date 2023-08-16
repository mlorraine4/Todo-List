import { Storage } from "./storage";
import Todo from "./ToDo";
import "./style.css";
import {
  addProjectButton,
  closeEditForm,
  closeMainForm,
  displayAllProjectButtons,
  displayError,
  displayTask,
  openEditForm,
  removeTaskFromDisplay,
  showTaskInEditForm,
  togglePage,
  toggleProjectForm,
} from "./display";
import flatpickr from "flatpickr";
import parse from "date-fns/parse";
import add from "date-fns/add";
import format from "date-fns/format";
import uniqid from "uniqid";
import { myList } from "./Controller";

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

App();

// DOM elements and event listeners.
let mainForm = document.querySelector(".formMain");
mainForm.onsubmit = handleSubmitMain;
let editForm = document.querySelector(".editForm");
editForm.onsubmit = handleSubmitEdit;
let newProjectBtn = document.getElementById("newProjectSubmitBtn");
newProjectBtn.onclick = handleAddProject;

// forms functionality
const handleSubmitMain = (e) => {
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

function handleSubmitEdit(e) {
  e.preventDefault();
  let id = myList.task;
  let selectedProject = myList.project;
  let timestamp = Storage.myToDoList.allTasks[id].timestamp;
  var title = document.getElementById("titleEdit").value;
  var description = document.getElementById("descriptionEdit").value;
  var dueDate = document.getElementById("dueDateEdit").value;
  var select = document.querySelector("#priorityEdit");
  var priority = select.options[select.selectedIndex].value;
  if (validateForm(dueDate)) {
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
  } else {
    displayError();
  }
}

function handleAddProject(e) {
  e.preventDefault();
  let project = document.getElementById("projectInput").value;

  Storage.addProject(project);
  togglePage(addProjectButton(project));
  toggleProjectForm();
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
  myList.task = id;
  openEditForm();
  showTaskInEditForm(task);
}

export function handleDeleteProject(e) {
  let div = e.target.parentElement;
  let project = e.target.previousSibling.data;

  // remove button
  div.remove();

  // delete tasks and project from storage
  Storage.removeProject(project);

  togglePage(document.getElementById("home"));
}

document.addEventListener(
  "click",
  function (e) {
    if (e.target.matches(".mainNav")) {
      togglePage(e.target);
    }
    if (e.target.matches(".projectTab")) {
      togglePage(e.target);
    }
  },
  false
);
