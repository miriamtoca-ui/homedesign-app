import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";

import { projectCatalog } from "../data";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectCatalog.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">{project.name}</h1>
        <span className="rounded-full bg-[#cc7046] px-3 py-1 text-xs font-medium text-white">{project.status}</span>
      </section>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Descripción</h2>
        <p className="mt-4 text-sm text-[#73685d]">{project.description}</p>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Dirección completa</h2>
        <div className="mt-4 space-y-2 text-sm text-[#73685d]">
          <p>Calle: {project.address.street}</p>
          <p>Ciudad: {project.address.city}</p>
          <p>Código postal: {project.address.postalCode}</p>
          <p>País: {project.address.country}</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Habitaciones</h2>
        {project.rooms.length === 0 ? (
          <p className="mt-4 text-sm text-[#73685d]">Sin habitaciones</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-[#73685d]">
            {project.rooms.map((room) => (
              <li key={room}>{room}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Clientes asociados</h2>
        {project.clientNames.length === 0 ? (
          <p className="mt-4 text-sm text-[#73685d]">Sin clientes asociados</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-[#73685d]">
            {project.clientNames.map((clientName) => (
              <li key={clientName}>{clientName}</li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
