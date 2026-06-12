"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedPage from "@/app/components/ProtectedPage";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AllTasksPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const fetchTasks = (message = "") => {
    return api
      .get("/tasks")
      .then((res) => {
        setTasks(res.data.data || res.data);
        if (message) {
          setSuccess(message);
        }
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setSuccess("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const grouped = tasks.reduce((acc, task) => {
    const projectName = task.project?.name || "Unknown Project";

    if (!acc[projectName]) {
      acc[projectName] = [];
    }

    acc[projectName].push(task);

    return acc;
  }, {});

  return (
    <ProtectedPage>
      <section className="section-stack py-6">
        <div className="space-y-2">
          <p className="eyebrow">All Tasks</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Tasks overview
          </h1>
          <p className="text-sm text-slate-600">
            View all tasks grouped by project.
          </p>
        </div>

        {loading ? (
          <div className="surface-card p-5 rounded-[1rem] text-sm text-slate-600">
            Loading tasks...
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No tasks found.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([projectName, projectTasks]) => (
              <div key={projectName} className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {projectName}
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {projectTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/projects/${task.project?.id}/tasks`}
                      className="surface-card rounded-[1rem] p-5 hover:shadow-md transition"
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
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedPage>
  );
}