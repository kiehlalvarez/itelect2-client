import { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import "./App.css";

// Session 13: tasks are typed in here, in the browser.
// Session 14 replaces this array with a call to the API.
const STARTING_TASKS = [
  { id: 1, title: "Finish GT13", dueDate: "2026-10-21" },
  { id: 2, title: "Study for exam", dueDate: "2026-10-28" },
  { id: 3, title: "Submit capstone update", dueDate: "2026-11-02" },
];

function App() {
  const [tasks, setTasks] = useState(STARTING_TASKS);

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      dueDate: "2026-12-01",
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <main className="tasks-app">
      <h1>Task Manager</h1>
      <p className="count">{tasks.length} tasks</p>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;