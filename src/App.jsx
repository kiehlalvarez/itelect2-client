import { useEffect, useState } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import "./App.css";

// GT14: the address of the API, read from .env
const API_URL = import.meta.env.VITE_API_URL;

// Asks the API for every task. Returns the array, or throws.
async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error(`GET /api/tasks answered ${res.status}`);
  }
  return res.json();
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loggedInAs, setLoggedInAs] = useState("");

  // Runs once, after the first render ([] at the end)
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  async function logIn(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || "Login failed");
    }
    setToken(data.token);
    setLoggedInAs(email);
  }

  function logOut() {
    setToken("");
    setLoggedInAs("");
  }

  async function addTask(title) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // must match the body your Postman POST /api/tasks sends
      body: JSON.stringify({ title: title, dueDate: "2026-12-01" }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || data.message || "Could not add task");
    }
    // the task is in the database now: ask for the list again
    const data = await fetchTasks();
    setTasks(data);
  }

  return (
    <main className="tasks-app">
      <h1>Task Manager</h1>

      {token ? (
        <p className="who">
          <span>Logged in as {loggedInAs}</span>
          <button onClick={logOut}>Log out</button>
        </p>
      ) : (
        <LoginForm onLogin={logIn} />
      )}

      {token && <TaskForm onAdd={addTask} />}

      {loading && <p className="count">Loading tasks...</p>}
      {error && <p className="error">Could not load the tasks: {error}</p>}
      {!loading && !error && (
        <>
          <p className="count">{tasks.length} tasks</p>
          <TaskList tasks={tasks} />
        </>
      )}
    </main>
  );
}

export default App;