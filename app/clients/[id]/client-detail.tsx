"use client";

import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import type { ClientWithRelations, ProjectRecord } from "@/lib/supabase";

import { updateClientAction } from "./actions";

type ActionState = {
  error?: string;
  success?: boolean;
};

const initialState: ActionState = {};

export function ClientDetail({ client, allProjects }: { client: ClientWithRelations; allProjects: ProjectRecord[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateClientAction, initialState);

  const selectedProjectIds = useMemo(
    () => client.project_clients.map((relation) => relation.project_id),
    [client.project_clients],
  );


  return (
    <main className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">{client.name}</h1>
          <p className="mt-2 text-sm text-[#73685d]">{client.email || "Sin email"}</p>
          <p className="mt-1 text-sm text-[#73685d]">{client.phone || "Sin teléfono"}</p>
        </div>
        <Button onClick={() => setOpen(true)}>Editar cliente</Button>
      </section>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Datos personales</h2>
        <div className="mt-4 space-y-2 text-sm text-[#73685d]">
          <p>Nombre: {client.name}</p>
          <p>Email: {client.email || "Sin email"}</p>
          <p>Teléfono: {client.phone || "Sin teléfono"}</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Dirección</h2>
        <p className="mt-4 text-sm text-[#73685d]">
          {client.street || ""} {client.city || ""} {client.postal_code || ""} {client.country || ""}
        </p>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Estado</h2>
        <p className="mt-4 text-sm text-[#73685d]">Activo</p>
      </Card>

      <Card>
        <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Proyectos asociados</h2>
        {client.project_clients.length === 0 ? (
          <p className="mt-4 text-sm text-[#73685d]">Sin proyectos asociados</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-[#73685d]">
            {client.project_clients.map((relation) => (
              <li key={`${relation.project_id}`}>{relation.projects?.name ?? "Proyecto"}</li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Editar cliente">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={client.id} />
          <FormField label="Nombre *" name="name" defaultValue={client.name} required />
          <FormField label="Email" name="email" type="email" defaultValue={client.email ?? ""} />
          <FormField label="Teléfono" name="phone" defaultValue={client.phone ?? ""} />
          <FormField label="Calle" name="street" defaultValue={client.street ?? ""} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Ciudad" name="city" defaultValue={client.city ?? ""} />
            <FormField label="Código postal" name="postal_code" defaultValue={client.postal_code ?? ""} />
          </div>
          <FormField label="País" name="country" defaultValue={client.country ?? ""} />

          <label className="block text-sm text-[#73685d]">
            <span className="mb-2 block">Proyectos asociados</span>
            <select
              name="project_ids"
              multiple
              defaultValue={selectedProjectIds}
              className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
            >
              {allProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
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
