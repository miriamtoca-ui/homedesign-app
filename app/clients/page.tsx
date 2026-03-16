import { listClients, listProjects } from "@/lib/supabase";

import { ClientsDashboard } from "./clients-dashboard";

export default async function ClientsPage() {
  const { data: clients } = await listClients();
  const { data: projects } = await listProjects();

  return <ClientsDashboard initialClients={clients} allProjects={projects} />;
}
