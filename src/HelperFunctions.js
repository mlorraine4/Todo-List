import { myList } from "./Controller";
import {
  addProjectButton,
  closeEditForm,
  closeMainForm,
  displayError,
  displayTask,
  openEditForm,
  removeTaskFromDisplay,
  showTaskInEditForm,
  togglePage,
  toggleProjectForm,
  updateTaskDiv,
} from "./display";
import { Storage } from "./storage";
import uniqid from "uniqid";

// forms functionality
export function handleSubmitMain(e) {
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
}

export function handleSubmitEdit(e) {
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

export function handleAddProject(e) {
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

export function validateForm(date) {
  if (date.length !== 0) {
    return true;
  } else {
    return false;
  }
}