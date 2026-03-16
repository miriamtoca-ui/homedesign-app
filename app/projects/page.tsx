import { listClients, listProjects } from "@/lib/supabase";

import { ProjectsDashboard } from "./projects-dashboard";

export default async function ProjectsPage() {
  const { data: projects } = await listProjects();
  const { data: clients } = await listClients();

  return <ProjectsDashboard initialProjects={projects} allClients={clients} />;
}
