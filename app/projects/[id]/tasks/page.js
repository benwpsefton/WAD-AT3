"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function ProjectTasksPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTasks() {
      try {
        const res = await api.get(`/tasks/projects/${id}`);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Tasks</h1>

      <p>Project ID: {id}</p>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3 className="task-title">{task.name}</h3>

              <p className="task-description">{task.description}</p>

              <span className={`task-status ${task.status}`}>
                {task.status}
              </span>

              <div className="task-project">Project: {task.project?.name}</div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
