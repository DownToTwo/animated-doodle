import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
function App(props) {
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    return storedTasks;
  });
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    // Update filteredTasks whenever tasks or filter changes
    const filtered = tasks.filter(FILTER_MAP[filter]);
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Calculate remaining tasks count after updating tasks
    const remainingTasksCount = filteredTasks.filter(
      (task) => !task.completed,
    ).length;
    const tasksNoun = remainingTasksCount !== 1 ? "tasks" : "task";
    const headingText = `${remainingTasksCount} ${tasksNoun} remaining`;
    listHeadingRef.current.textContent = headingText;
  }, [tasks, filteredTasks]);

  function addTask(name) {
    const newTask = { id: name, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const remainingTasksCount = filteredTasks.filter(
    (task) => !task.completed,
  ).length;
  const tasksNoun = remainingTasksCount !== 1 ? "tasks" : "task";
  const headingText = `${remainingTasksCount} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const MemoizedTodoList = React.memo(
    ({ tasks, filter, toggleTaskCompleted, deleteTask, editTask }) => {
      const taskList = tasks
        .filter(FILTER_MAP[filter])
        .map((task) => (
          <Todo
            id={task.id}
            name={task.name}
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ));

      return <>{taskList}</>;
    },
  );
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>

      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>

      <ul // eslint-disable-line
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        <MemoizedTodoList
          tasks={tasks}
          filter={filter}
          toggleTaskCompleted={toggleTaskCompleted}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      </ul>
    </div>
  );
}

export default App;
