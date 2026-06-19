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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-semibold">Comments</h2>

          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-lg leading-none text-slate-600 hover:bg-slate-100 hover:text-black"
            aria-label="Close modal"
          >
            X
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          <Comments id={id} type={type} />
        </div>
      </div>
    </div>
  );
}
