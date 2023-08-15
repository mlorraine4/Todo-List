// window.localStorage to retrieve data
/* to-do-list: {
    allTasks = {id: {task1}, id: {task2}},
    PROJ1_NAME: {
        tasks = {id: {task1}, id: {task2}}
    },
}

*/
const Storage = (() => {
  let storageData = JSON.parse(window.localStorage.getItem("to-do-list"));
  let myToDoList = storageData;

  // Save data object to local storage.
  const save = () => {
    window.localStorage.setItem("to-do-list", JSON.stringify(myToDoList));
    console.log(storageData);
  };

  //  Create storage ref for first time users.
  const createStorage = () => {
    window.localStorage.setItem("to-do-list", JSON.stringify({ allTasks: {} }));
  };

  // Add task to data object.
  const addTask = (task) => {
    if (task.selectedProject) {
      // add task to proj obj
      myToDoList[task.selectedProject][task.id] = task;
    }
    // save to all tasks
    myToDoList.allTasks[task.id] = task;
    save();
  };

  // Remove task from data object.
  const removeTask = (id) => {
    let project = myToDoList.allTasks[id].selectedProject;
    if (project) {
      // remove from project
      console.log("is part of project");
      delete myToDoList[project][id];
    }
    // remove from all tasks
    delete myToDoList.allTasks[id];
    save();
  };

  // Add project to data object.
  const addProject = (projName) => {
    myToDoList[projName] = {};
    save();
  };

  // Remove project from data object, along with any associated tasks.
  const removeProject = (projName) => {
    let tasks = Object.values(myToDoList[projName]);
    tasks.forEach((task) => {
      removeTask(task.id);
    });
    delete myToDoList[projName];
    save();
  };

  return {
    save,
    addTask,
    removeTask,
    addProject,
    removeProject,
    createStorage,
    myToDoList
  };
})();

export { Storage };
