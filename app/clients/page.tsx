import { listClients } from "@/lib/supabase";

import { ClientsDashboard } from "./clients-dashboard";

export default async function ClientsPage() {
  const { data: clients } = await listClients();

  return <ClientsDashboard initialClients={clients} />;
}
