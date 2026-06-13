"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <section className="section-stack py-6 md:py-10">
      <div className="surface-card overflow-hidden rounded-[1.125rem]">
        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.25fr_0.75fr] md:px-10 md:py-10">
          <div className="space-y-6">
            <p className="eyebrow">Overview</p>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                A simple frontend for users, projects, and API examples.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Use this app to browse users, manage projects, and manage all project tasks. The layout has been simplified to keep the main
                routes easy to scan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="button-primary hover:button-primary-hover"
              >
                Open Projects
              </Link>
              <Link
                href="/users"
                className="button-secondary hover:border-slate-400 hover:bg-white"
              >
                Open Users
              </Link>
              <Link
                href="/tasks"
                className="button-secondary hover:border-amber-400 hover:bg-white"
              >
                Open Tasks
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              ["Users", "View the user list and basic account details."],
              ["Projects", "Create, edit, and remove projects."],
              ["Tasks", "View global tasks grouped by project."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
