"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Milestones({ projectId }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    due_date: "",
    project_id: ""
  });
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneError, setMilestoneError] = useState(null);
  const [milestoneSuccess, setMilestoneSuccess] = useState("");

  const fetchMilestones = (projectId, message = "") => {
    return api
      .get("/milestones")
      .then((res) => {
        const filtered = Array.isArray(res.data)
          ? res.data.filter((m) => m.project?.id === projectId)
          : [];

        setMilestones(filtered);

        if (message) {
          setMilestoneSuccess(message);
        }

        setMilestoneError(null);
      })
      .catch((err) => {
        console.error("Failed to load milestones:", err);
        setMilestones([]);
        setMilestoneError(err.message);
        setMilestoneSuccess("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMilestones(projectId);
  }, [projectId]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-slate-500">
        Loading milestones...
      </div>
    );
  }

  const visible = expanded ? milestones : milestones.slice(0, 2);

  const handleMilestoneSubmit = (e) => {
    e.preventDefault();

    const formMethod = editingMilestone ? api.put : api.post;
    const actionLabel = editingMilestone ? "updated" : "created";
    const url = editingMilestone
      ? `/milestones/${editingMilestone}`
      : "/milestones";

    formMethod(url, milestoneForm)
      .then(() => fetchMilestones(`Milestone ${actionLabel} successfully.`))
      .then(() => {
        setMilestoneForm({
          title: "",
          description: "",
          due_date: "",
          project_id: ""
        });
        setEditingMilestone(null);
      })
      .catch((err) => {
        setMilestoneError(err.message);
        setMilestoneSuccess("");
      });
  };

  const handleMilestoneDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    try {
      await api.delete(`/milestones/${id}`);
      setMilestones((prev) => prev.filter((m) => m.id !== id));
      await fetchMilestones("Milestone deleted successfully.");
    } catch (err) {
      setMilestoneError(err.message);
      setMilestoneSuccess("");
    }
  };

  const handleMilestoneEdit = (milestone) => {
    setMilestoneForm({
      title: milestone.title,
      description: milestone.description,
      due_date: milestone.due_date,
      project_id: milestone.project?.id
    });
    setEditingMilestone(milestone.id);
  };

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">
        Milestones
      </h3>

      {milestones.length === 0 ? (
        <p className="text-sm text-slate-500">
          No milestones for this project.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {visible.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-slate-200 bg-white/80 p-3"
              >
                <p className="text-sm font-medium text-slate-900">
                  {m.title}
                </p>

                {m.description && (
                  <p className="mt-1 text-sm text-slate-600">
                    {m.description}
                  </p>
                )}

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>Due: {m.due_date}</span>

                  <span>
                    {m.completed_at ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {milestones.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              {expanded
                ? "Show less"
                : `View ${milestones.length - 2} more`}
            </button>
          )}
        </>
      )}
    </div>
  );
}