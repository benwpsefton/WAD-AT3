"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import ProtectedPage from "@/app/components/ProtectedPage";
import Link from "next/link";
import Comments from "@/app/components/Comments";

export default function ProjectTasksPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskForm, setTaskForm] = useState({ name: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [taskError, setTaskError] = useState(null);
  const [taskSuccess, setTaskSuccess] = useState("");
  const [checklists, setChecklists] = useState([]);
  const [checklistForm, setChecklistForm] = useState({
    label: "",
    completed: 0,
    task_id: ""
  });
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [checklistError, setChecklistError] = useState(null);
  const [checklistSuccess, setChecklistSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        const [tasksRes, checklistRes] = await Promise.all([
          api.getCached(`/tasks/projects/${id}`),
          api.getCached("/checklist-items"),
        ]);

        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setChecklists(Array.isArray(checklistRes.data) ? checklistRes.data : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setTasks([]);
        setChecklists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const getChecklistForTask = (taskId) => {
    return checklists.filter((item) => item.task_id === taskId);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const formMethod = editingTask ? api.put : api.post;
    const actionLabel = editingTask ? "updated" : "created";
    const url = editingTask ? `/tasks/${editingTask}` : "/tasks";

    formMethod(url, taskForm)
      .then(() => fetchTasks(`Task ${actionLabel} successfully.`))
      .then(() => {
        setTaskForm({ name: "", description: "" });
        setEditingTask(null);
      })
      .catch((err) => {
        setTaskError(err.message);
        setTaskSuccess("");
      });
  };

  const handleTaskDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await fetchTasks("Task deleted successfully.");
    } catch (err) {
      setTaskError(err.message);
      setTaskSuccess("");
    }
  };

  const handleTaskEdit = (task) => {
    setTaskForm({ name: task.name, description: task.description });
    setEditingTask(task.id);
  };

  const handleChecklistSubmit = (e) => {
    e.preventDefault();

    const formMethod = editingChecklist ? api.put : api.post;
    const actionLabel = editingChecklist ? "updated" : "created";
    const url = editingChecklist
      ? `/checklist-items/${editingChecklist}`
      : "/checklist-items";

    formMethod(url, checklistForm)
      .then(() => fetchChecklists(`Checklist ${actionLabel} successfully.`))
      .then(() => {
        setChecklistForm({ label: "", completed: 0, task_id: "" });
        setEditingChecklist(null);
      })
      .catch((err) => {
        setChecklistError(err.message);
        setChecklistSuccess("");
      });
  };

  const handleChecklistDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this checklist item?")) return;

    try {
      await api.delete(`/checklist-items/${id}`);
      setChecklists((prev) => prev.filter((c) => c.id !== id));
      await fetchChecklists("Checklist deleted successfully.");
    } catch (err) {
      setChecklistError(err.message);
      setChecklistSuccess("");
    }
  };

  const handleChecklistEdit = (item) => {
    setChecklistForm({
      label: item.label,
      completed: item.completed,
      task_id: item.task_id
    });
    setEditingChecklist(item.id);
  };

  return (
    <ProtectedPage>
      <section className="section-stack py-6">
        <div className="space-y-2">
          <p className="eyebrow">Project Tasks</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Tasks for project
          </h1>
          <p className="text-sm text-slate-600">
            Project ID: {id}
          </p>
        </div>

        <div>
          <Link
            href="/projects"
            className="button-secondary hover:border-slate-400 hover:bg-white"
          >
            &larr; Back to projects
          </Link>
        </div>

        {loading ? (
          <div className="surface-card p-5 rounded-[1rem] text-sm text-slate-600">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="surface-card p-5 rounded-[1rem] text-sm text-slate-600">
            No tasks found for this project.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {tasks.map((task) => {
              const taskChecklist = getChecklistForTask(task.id);

              return (
                <div key={task.id} className="surface-card rounded-[1rem] p-5">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {task.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {task.description}
                  </p>

                  <div className="mt-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium
                        ${
                          task.status === "done"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.status === "in_progress"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Project: {task.project?.name}
                  </p>

                  {taskChecklist.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-600">
                        Checklist
                      </p>

                      {taskChecklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed === 1}
                            readOnly
                          />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 gap-4">
                    <Comments id={task.id} type="Task" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </ProtectedPage>
  );
}