"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Comments({ id, type }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await api.getCached("/comments");

        const filtered = res.data.filter(
          (c) =>
            c.commentable.type === type &&
            c.commentable.id === id
        );

        setComments(filtered);
      } catch (err) {
        console.error("Failed to load comments", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [id, type]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-slate-500">
        Loading comments...
      </div>
    );
  }

  const visibleComments = expanded
    ? comments
    : comments.slice(0, 2);

  return (
    <div className="mt-5 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">
        Comments
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-500">
          No comments yet.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {visibleComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-slate-200 bg-white/80 p-3"
              >
                <p className="text-sm text-slate-800">
                  {comment.content}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  By {comment.user.name}
                </p>
              </div>
            ))}
          </div>

          {comments.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              {expanded
                ? "Show less"
                : `View ${comments.length - 2} more`}
            </button>
          )}
        </>
      )}
    </div>
  );
}