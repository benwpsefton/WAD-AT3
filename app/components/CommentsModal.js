"use client";

import { useEffect } from "react";
import Comments from "./Comments";

export default function CommentsModal({ isOpen, onClose, id, type }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Comments</h2>

          <button
            onClick={onClose}
            className="text-sm text-slate-600 hover:text-black"
          >
            Close
          </button>
        </div>

        <Comments id={id} type={type} />
      </div>
    </div>
  );
}