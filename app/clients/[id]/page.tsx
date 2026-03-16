import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { listClients } from "@/lib/supabase";

import { projectCatalog } from "@/app/projects/data";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: clients } = await listClients();

  const client = clients.find((item) => item.id === id);

  if (!client) {
    notFound();
  }

  const relatedProjects = projectCatalog.filter((project) => project.clientIds.includes(client.id));

  return (
    <main className="space-y-8">
      <section>
        <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">{client.name}</h1>
        <p className="mt-2 text-sm text-[#73685d]">{client.email || "Sin email"}</p>
        <p className="mt-1 text-sm text-[#73685d]">Sin teléfono</p>
      </section>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Datos personales</h2>
        <div className="mt-4 space-y-2 text-sm text-[#73685d]">
          <p>Nombre: {client.name}</p>
          <p>Email: {client.email || "Sin email"}</p>
          <p>Teléfono: Sin teléfono</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Dirección</h2>
        <p className="mt-4 text-sm text-[#73685d]">Sin dirección registrada</p>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Estado</h2>
        <p className="mt-4 text-sm text-[#73685d]">Activo</p>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Proyectos asociados</h2>
        {relatedProjects.length === 0 ? (
          <p className="mt-4 text-sm text-[#73685d]">Sin proyectos asociados</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-[#73685d]">
            {relatedProjects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
