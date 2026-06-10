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

  useEffect(() => {
    if (!id) return;

    async function fetchTasks() {
      try {
        setLoading(true);

        const res = await api.get(`/tasks/projects/${id}`);

        const data = Array.isArray(res.data) ? res.data : [];

        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [id]);

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
            {tasks.map((task) => (
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
                
                <div className="mt-6 gap-4">
                  <Comments id={task.id} type="Task" />
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedPage>
  );
}