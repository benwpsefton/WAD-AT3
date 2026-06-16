"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", {
        ...form,
        workspace_type: "project_management",
      });

      const token = res.data.token || res.data.access_token;

      if (!token) {
        throw new Error("No token returned from API");
      }

      localStorage.setItem("token", token);

      router.push("/projects");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-stack py-10">
      <div className="max-w-md mx-auto surface-card rounded-[1rem] p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-950">Login</h1>

        <p className="text-sm text-slate-600">
          Sign in to access your project workspace.
        </p>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded-lg p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
