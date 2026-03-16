"use client";

import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import type { ClientRecord, ProjectWithRelations } from "@/lib/supabase";

import { updateProjectAction } from "./actions";

type ActionState = {
  error?: string;
  success?: boolean;
};

const initialState: ActionState = {};

export function ProjectDetail({ project, allClients }: { project: ProjectWithRelations; allClients: ClientRecord[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateProjectAction, initialState);

  const selectedClientIds = useMemo(
    () => project.project_clients.map((relation) => relation.client_id),
    [project.project_clients],
  );


  return (
    <main className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">{project.name}</h1>
          <p className="mt-2 text-sm text-[#73685d]">Inicio: {project.start_date || "Sin fecha"}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#cc7046] px-3 py-1 text-xs font-medium text-white">
            {project.status ?? "Activo"}
          </span>
          <Button onClick={() => setOpen(true)}>Editar proyecto</Button>
        </div>
      </section>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Descripción</h2>
        <p className="mt-4 text-sm text-[#73685d]">Proyecto de diseño interior en curso.</p>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Dirección completa</h2>
        <div className="mt-4 space-y-2 text-sm text-[#73685d]">
          <p>Calle: {project.street || ""}</p>
          <p>Ciudad: {project.city || ""}</p>
          <p>Código postal: {project.postal_code || ""}</p>
          <p>País: {project.country || ""}</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Habitaciones</h2>
        {project.rooms.length === 0 ? (
          <p className="mt-4 text-sm text-[#73685d]">Sin habitaciones</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-[#73685d]">
            {project.rooms.map((room) => (
              <li key={room.id}>
                {room.name || "Habitación"} · {room.type || "Sin tipo"} · {room.area_m2 ?? "-"} m²
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Clientes asociados</h2>
        {project.project_clients.length === 0 ? (
          <p className="mt-4 text-sm text-[#73685d]">Sin clientes asociados</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-[#73685d]">
            {project.project_clients.map((relation) => (
              <li key={`${relation.client_id}`}>{relation.clients?.name ?? "Cliente"}</li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Editar proyecto">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={project.id} />
          <FormField label="Nombre *" name="name" required defaultValue={project.name} />
          <FormField label="Estado" name="status" defaultValue={project.status ?? "Activo"} />
          <FormField label="Calle" name="street" defaultValue={project.street ?? ""} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Ciudad" name="city" defaultValue={project.city ?? ""} />
            <FormField label="Código postal" name="postal_code" defaultValue={project.postal_code ?? ""} />
          </div>
          <FormField label="País" name="country" defaultValue={project.country ?? ""} />
          <FormField label="Fecha inicio" name="start_date" type="date" defaultValue={project.start_date ?? ""} />

          <label className="block text-sm text-[#73685d]">
            <span className="mb-2 block">Clientes asociados</span>
            <select
              name="client_ids"
              multiple
              defaultValue={selectedClientIds}
              className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
            >
              {allClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Modal>
    </main>
  );
}

function FormField({
  label,
  name,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm text-[#73685d]">
      <span className="mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
      />
    </label>
  );
}
