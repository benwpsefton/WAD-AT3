"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Milestones({ projectId }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchMilestones() {
      try {
        const res = await api.get("/milestones");

        const filtered = res.data.filter(
          (m) => m.project?.id === projectId
        );

        setMilestones(filtered);
      } catch (err) {
        console.error("Failed to load milestones:", err);
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMilestones();
  }, [projectId]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-slate-500">
        Loading milestones...
      </div>
    );
  }

  const visible = expanded ? milestones : milestones.slice(0, 2);

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