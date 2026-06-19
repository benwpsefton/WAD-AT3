"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Checklists({ taskId }) {
  const fetchChecklists = (message = "") => {
    return api
      .get(`/checklist-items`)
      .then((res) => {
        setChecklists(res.data.data || res.data);
        if (message) {
          setChecklistSuccess(message);
        }
        setChecklistError(null);
      })
      .catch((err) => {
        setChecklistError(err.message);
        setChecklistSuccess("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const getChecklistForTask = (taskId) => {
    return checklists.filter((item) => item.task_id === taskId);
  };

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
}
