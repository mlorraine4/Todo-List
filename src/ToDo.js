const Todo = function (
  title,
  description,
  dueDate,
  priority,
  id,
  selectedProject,
  timestamp
) {
  this.title = title;
  this.description = description;
  this.dueDate = dueDate;
  this.priority = priority;
  this.id = id;
  this.selectedProject = selectedProject;
  this.timestamp = timestamp;

  return { title, description, dueDate, priority, id, selectedProject, timestamp };
};

export default Todo;
