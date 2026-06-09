"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="flex min-h-[20rem] items-center justify-center">
        <p className="text-sm text-slate-600">
          Checking authentication...
        </p>
      </div>
    );
  }

  return children;
}