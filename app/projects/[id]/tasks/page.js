import ProjectTasksPage from "@/app/components/ProjectTasksPageClient";
import api from "@/lib/api";

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) {
    return [];
  }
  try {
    const res = await api.getCached("/projects");
    const projects = res.data.data || res.data || [];
    return projects
      .filter((project) => project?.id)
      .map((project) => ({ id: project.id.toString() }));
  } catch (error) {
    console.warn("Unable to pre-generate project pages:", error.message);
    return [];
  }
}

export default function Page() {
  return <ProjectTasksPage />;
}
