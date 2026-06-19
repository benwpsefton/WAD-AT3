"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import ProtectedPage from "@/app/components/ProtectedPage";
import Link from "next/link";
import Comments from "@/app/components/Comments";
import { useCallback } from "react";
import Checklists from "./Checklists";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProjectTasksPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    status: "todo",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [taskError, setTaskError] = useState(null);
  const [taskSuccess, setTaskSuccess] = useState("");

  const fetchTasks = useCallback(
    (message = "") => {
      return api
        .get(`/tasks/projects/${id}`)
        .then((res) => {
          setTasks(res.data.data || res.data);
          if (message) {
            setTaskSuccess(message);
          }
          setTaskError(null);
        })
        .catch((err) => {
          setTaskError(err.message);
          setTaskSuccess("");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [id],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const formMethod = editingTask ? api.put : api.post;
    const actionLabel = editingTask ? "updated" : "created";
    const url = editingTask ? `/tasks/${editingTask}` : "/tasks";

    formMethod(url, {
      ...taskForm,
      project_id: id,
    })
      .then(() => fetchTasks(`Task ${actionLabel} successfully.`))
      .then(() => {
        setTaskForm({ name: "", description: "", status: "todo" });
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
      setTasks((prev) => prev.filter((task) => task.id !== id));
      await fetchTasks("Task deleted successfully.");
      await wait(200);
    } catch (err) {
      setTaskError(err.message);
      setTaskSuccess("");
    }
  };

  const handleTaskEdit = (task) => {
    setTaskForm({
      name: task.name,
      description: task.description,
      status: task.status,
    });
    setEditingTask(task.id);
  };

  return (
    <ProtectedPage>
      <section className="section-stack py-6">
        <div className="space-y-2">
          <p className="eyebrow">Project Tasks</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Tasks for project
          </h1>
          <p className="text-sm text-slate-600">Project ID: {id}</p>
        </div>

        <div>
          <Link
            href="/projects"
            className="button-secondary hover:border-slate-400 hover:bg-white"
          >
            &larr; Back to projects
          </Link>
        </div>

        {taskError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <p className="font-semibold">This action could not be completed.</p>
            <p>{taskError}</p>
          </div>
        )}

        {!taskError && taskSuccess && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            <p className="font-semibold">Status</p>
            <p>{taskSuccess}</p>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <form
            onSubmit={handleTaskSubmit}
            className="surface-card space-y-4 rounded-[1rem] p-5"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-950">
                {editingTask ? "Edit task" : "New task"}
              </p>

              <p className="text-sm leading-6 text-slate-600">
                Add a task name, description and status.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Task Name
              </label>

              <input
                type="text"
                value={taskForm.name}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, name: e.target.value })
                }
                className="rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    description: e.target.value,
                  })
                }
                rows="4"
                className="rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={taskForm.status}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    status: e.target.value,
                  })
                }
                className="rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="button-primary hover:button-primary-hover"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>

              {editingTask && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null);
                    setTaskForm({
                      name: "",
                      description: "",
                      status: "todo",
                    });
                  }}
                  className="button-secondary hover:border-slate-400 hover:bg-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">
                Current tasks
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Select a task to edit or delete it.
              </p>
            </div>

            {loading ? (
              <div className="surface-card p-5 rounded-[1rem] text-sm text-slate-600">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No tasks yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create a task using the form on the left.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task) => {
                  <div
                    key={task.id}
                    className="surface-card rounded-[1rem] p-5"
                  >
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

                    <div className="flex gap-2 mt-4 mb-6">
                      <button
                        onClick={() => handleTaskEdit(task)}
                        className="button-secondary px-3 py-2 text-sm hover:border-slate-400 hover:bg-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleTaskDelete(task.id)}
                        className="rounded-[0.75rem] bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>

                    <Checklists taskId={task.id} />

                    <div className="mt-6 gap-4">
                      <Comments id={task.id} type="Task" />
                    </div>
                  </div>;
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
