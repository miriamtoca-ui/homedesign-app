import { notFound } from "next/navigation";

import { getProjectById, listClients } from "@/lib/supabase";

import { ProjectDetail } from "./project-detail";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: project } = await getProjectById(id);
  const { data: clients } = await listClients();

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} allClients={clients} />;
}
