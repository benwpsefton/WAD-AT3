"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useCallback } from "react";

export default function Comments({ id, type }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [commentForm, setCommentForm] = useState({
    content: "",
    commentable_id: "",
    type: "",
  });
  const [editingComment, setEditingComment] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState("");

  const fetchComments = useCallback(
    (message = "") => {
      return api
        .get("/comments")
        .then((res) => {
          const filtered = Array.isArray(res.data)
            ? res.data.filter(
                (c) => c.commentable.type === type && c.commentable.id === id,
              )
            : [];

          setComments(filtered);

          if (message) {
            setCommentSuccess(message);
          }

          setCommentError(null);
        })
        .catch((err) => {
          console.error("Failed to load comments", err);
          setComments([]);
          setCommentError(err.message);
          setCommentSuccess("");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [id, type],
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-slate-500">Loading comments...</div>
    );
  }

  const visibleComments = expanded ? comments : comments.slice(0, 2);

  // const handleCommentSubmit = (e) => {
  //   e.preventDefault();

  //   const formMethod = editingComment ? api.put : api.post;
  //   const actionLabel = editingComment ? "updated" : "created";
  //   const url = editingComment ? `/comments/${editingComment}` : "/comments";

  //   formMethod(url, commentForm)
  //     .then(() => fetchComments(`Comment ${actionLabel} successfully.`))
  //     .then(() => {
  //       setCommentForm({ content: "", commentable_id: "", type: "" });
  //       setEditingComment(null);
  //     })
  //     .catch((err) => {
  //       setCommentError(err.message);
  //       setCommentSuccess("");
  //     });
  // };

  // const handleCommentDelete = async (id) => {
  //   if (!confirm("Are you sure you want to delete this comment?")) return;

  //   try {
  //     await api.delete(`/comments/${id}`);
  //     setComments((prev) => prev.filter((c) => c.id !== id));
  //     await fetchComments("Comment deleted successfully.");
  //   } catch (err) {
  //     setCommentError(err.message);
  //     setCommentSuccess("");
  //   }
  // };

  // const handleCommentEdit = (comment) => {
  //   setCommentForm({
  //     content: comment.content,
  //     commentable_id: comment.commentable?.id,
  //     type: comment.commentable?.type
  //   });
  //   setEditingComment(comment.id);
  // };

  return (
    <div className="mt-5 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">Comments</h3>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-500">No comments yet.</p>
      ) : (
        <>
          <div className="space-y-2">
            {visibleComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-slate-200 bg-white/80 p-3"
              >
                <p className="text-sm text-slate-800">{comment.content}</p>

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
              {expanded ? "Show less" : `View ${comments.length - 2} more`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
