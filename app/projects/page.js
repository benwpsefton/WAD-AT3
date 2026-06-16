"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedPage from "../components/ProtectedPage";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [taskCounts, setTaskCounts] = useState({});

  const fetchProjects = (message = "") => {
    return api
      .get("/projects")
      .then((res) => {
        setProjects(res.data.data || res.data);
        if (message) {
          setSuccess(message);
        }
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setSuccess("");
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchTaskCounts() {
      const counts = {};

      for (const project of projects) {
        try {
          const res = await api.getCached(`/tasks/projects/${project.id}`);
          counts[project.id] = Array.isArray(res.data) ? res.data.length : 0;
        } catch (err) {
          console.error(`Failed to fetch tasks for project ${project.id}`, err);

          counts[project.id] = 0;
        }
      }

      setTaskCounts(counts);
    }

    if (projects.length > 0) {
      fetchTaskCounts();
    }
  }, [projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formMethod = editing ? api.put : api.post;
    const actionLabel = editing ? "updated" : "created";
    const url = editing ? `/projects/${editing}` : "/projects";

    formMethod(url, form)
      .then(() => {
        return fetchProjects(`Project ${actionLabel} successfully.`);
      })
      .then(() => {
        setForm({ name: "", description: "" });
        setEditing(null);
      })
      .catch((err) => {
        setError(err.message);
        setSuccess("");
      });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      await fetchProjects("Project deleted successfully.");
      await wait(200);
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleEdit = (project) => {
    setForm({ name: project.name, description: project.description });
    setEditing(project.id);
  };

  return (
    <ProtectedPage>
      <section className="section-stack py-6">
        <div className="space-y-3">
          <p className="eyebrow">Projects</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Project workspace
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Create, update, and review project records from one screen.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <p className="font-semibold">This action could not be completed.</p>
            <p>{error}</p>
          </div>
        )}

        {!error && success && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            <p className="font-semibold">Status</p>
            <p>{success}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <form
            onSubmit={handleSubmit}
            className="surface-card space-y-4 rounded-[1rem] p-5"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-950">
                {editing ? "Edit project" : "New project"}
              </p>
              <p className="text-sm leading-6 text-slate-600">
                Add a name and optional description.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter a project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                placeholder="Describe the project (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                rows="4"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="button-primary hover:button-primary-hover"
              >
                {editing ? "Update Project" : "Add Project"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", description: "" });
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
                Current projects
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Select a project to view details or edit it from this list.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {projects.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center md:col-span-2">
                  <p className="text-sm font-medium text-slate-700">
                    No projects yet.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Create a project using the form on the left.
                  </p>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="surface-card rounded-[1rem] p-5"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="block text-lg font-semibold text-slate-950 hover:text-teal-700"
                    >
                      {project.name} →
                    </Link>
                    <p className="mt-2 text-sm text-slate-500">
                      Created: {project.created?.human}
                    </p>
                    <p className="mb-4 mt-2 text-sm leading-6 text-slate-600">
                      {project.description || "No description"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="button-secondary px-3 py-2 text-sm hover:border-slate-400 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="rounded-[0.75rem] bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                      <Link
                        href={`/projects/${project.id}/tasks`}
                        className="rounded-[0.75rem] bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                      >
                        View {taskCounts[project.id] ?? 0} tasks
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
