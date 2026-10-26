// Draws one <li> per task. It only reads the list it is given.
function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <span>{task.title}</span>
          <span className="due">{task.dueDate}</span>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;