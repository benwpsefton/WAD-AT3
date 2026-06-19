"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

export default function Checklists({ taskId }) {
  const [checklists, setChecklists] = useState([]);
  const [checklistForm, setChecklistForm] = useState({
    label: "",
    completed: 0,
    task_id: taskId,
  });
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [checklistError, setChecklistError] = useState(null);
  const [checklistSuccess, setChecklistSuccess] = useState("");

  const fetchChecklists = useCallback(
    (message = "") => {
      return api
        .get(`/checklist-items`)
        .then((res) => {
          const allItems = res.data.data || res.data;

          setChecklists(allItems.filter((item) => item.task_id === taskId));

          if (message) {
            setChecklistSuccess(message);
          }
          setChecklistError(null);
        })
        .catch((err) => {
          setChecklistError(err.message);
          setChecklistSuccess("");
        });
    },
    [taskId],
  );

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  const handleChecklistSubmit = (e) => {
    if (e) e.preventDefault();

    const formMethod = editingChecklist ? api.put : api.post;
    const actionLabel = editingChecklist ? "updated" : "created";
    const url = editingChecklist
      ? `/checklist-items/${editingChecklist}`
      : "/checklist-items";

    formMethod(url, {
      ...checklistForm,
    })
      .then(() => fetchChecklists(`Checklist ${actionLabel} successfully.`))
      .then(() => {
        setChecklistForm({
          label: "",
          completed: 0,
          task_id: "",
        });

        setEditingChecklist(null);
      })
      .catch((err) => {
        setChecklistError(err.message);
        setChecklistSuccess("");
      });
  };

  const handleChecklistDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this checklist item?"))
      return;

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
      task_id: item.task_id,
    });
    setEditingChecklist(item.id);
  };

  return (
    <section>
      {checklistError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <p className="font-semibold">This action could not be completed.</p>
          <p>{checklistError}</p>
        </div>
      )}

      {!checklistError && checklistSuccess && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 mb-4 text-sm text-teal-900">
          <p className="font-semibold">Status</p>
          <p>{checklistSuccess}</p>
        </div>
      )}

      {checklists.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={item.completed === 1} readOnly />

          <span className="flex-1">{item.label}</span>

          <button
            onClick={() => handleChecklistEdit(item)}
            className="text-xs text-slate-600"
          >
            Edit
          </button>

          <button
            onClick={() => handleChecklistDelete(item.id)}
            className="text-xs text-rose-600"
          >
            Delete
          </button>
        </div>
      ))}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="New checklist item"
          value={checklistForm.label}
          onChange={(e) =>
            setChecklistForm((prev) => ({
              ...prev,
              label: e.target.value,
            }))
          }
          className="flex-1 rounded border border-slate-300 p-1 text-sm"
        />

        <button
          type="button"
          onClick={handleChecklistSubmit}
          className="button-secondary px-2 text-sm"
        >
          {editingChecklist ? "Update" : "Add"}
        </button>
      </div>
    </section>
  );
}
