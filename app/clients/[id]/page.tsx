import { notFound } from "next/navigation";

import { getClientById, listProjects } from "@/lib/supabase";

import { ClientDetail } from "./client-detail";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: client } = await getClientById(id);
  const { data: allProjects } = await listProjects();

  if (!client) {
    notFound();
  }

  return <ClientDetail client={client} allProjects={allProjects} />;
}
