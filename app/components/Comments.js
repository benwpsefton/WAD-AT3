"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Comments({ projectId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await api.get("/comments");

        const filtered = res.data.filter(
          (c) =>
            c.commentable.type === "Project" &&
            c.commentable.id === projectId
        );

        setComments(filtered);
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [projectId]);

  if (loading) {
    return (
      <div className="surface-card p-5 rounded-[1rem] text-sm text-slate-600">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-950">
        Comments
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-600">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="surface-card rounded-[1rem] p-4"
          >
            <p className="text-sm text-slate-800">
              {comment.content}
            </p>

            <div className="mt-2 text-xs text-slate-500">
              By {comment.user.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
}