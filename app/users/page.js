"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import ProtectedPage from "../components/ProtectedPage";

const PAGE_SIZE = 5;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data.data || res.data);
        setCurrentPage(1);
        setSuccess("Users loaded successfully.");
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setSuccess("");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [currentPage, users]);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  if (loading) {
    return (
      <div className="surface-card flex min-h-[18rem] items-center justify-center rounded-[1rem] px-6 py-10">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading users…
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPage>
      <section className="section-stack py-6">
        <div className="space-y-3">
          <p className="eyebrow">Users</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            User directory
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Review user records, email details, and created dates.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <p className="font-semibold">This data could not be loaded.</p>
            <p>{error}</p>
          </div>
        )}

        {!error && success && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            <p className="font-semibold">Status</p>
            <p>{success}</p>
          </div>
        )}

        <div className="surface-card rounded-[1rem] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total users
              </p>
              <p className="text-xl font-semibold text-slate-950">
                {users.length}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {PAGE_SIZE} per page
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Page {currentPage}
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-left font-semibold text-slate-600">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => {
                  const emailValue =
                    typeof user.email === "string"
                      ? user.email
                      : user.email?.address;
                  const verified =
                    typeof user.email === "object"
                      ? user.email?.verified
                      : undefined;
                  const createdValue =
                    user.created?.human || user.created?.string || "—";

                  return (
                    <tr
                      key={user.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      } transition hover:bg-slate-50`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 font-semibold text-teal-700">
                            {getInitial(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="break-all text-sm text-slate-800">
                            {emailValue || "N/A"}
                          </span>
                          {verified !== undefined && (
                            <span
                              className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                                verified
                                  ? "bg-teal-100 text-teal-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {verified ? "Verified" : "Unverified"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {createdValue}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              className="button-secondary px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p className="text-slate-600">
              Page {currentPage} of {totalPages}
            </p>
            <button
              className="button-secondary px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
