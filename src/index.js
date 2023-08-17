import { Storage } from "./storage";
import "./style.css";
import {
  displayAllProjectButtons,
  togglePage,
} from "./display";
import flatpickr from "flatpickr";
import parse from "date-fns/parse";
import add from "date-fns/add";
import format from "date-fns/format";
import { handleAddProject, handleSubmitEdit, handleSubmitMain } from "./HelperFunctions";

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
