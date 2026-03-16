"use client";

import Link from "next/link";
import { useActionState, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import type { ClientRecord, ProjectWithRelations } from "@/lib/supabase";

import { createProjectAction } from "./actions";

type ActionState = {
  error?: string;
  success?: boolean;
};

const initialState: ActionState = {};

export function ProjectsDashboard({
  initialProjects,
  allClients,
}: {
  initialProjects: ProjectWithRelations[];
  allClients: ClientRecord[];
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createProjectAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);


  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase();
    return initialProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        `${project.street ?? ""} ${project.city ?? ""} ${project.postal_code ?? ""} ${project.country ?? ""}`
          .toLowerCase()
          .includes(term) ||
        (project.start_date ?? "").toLowerCase().includes(term),
    );
  }, [initialProjects, search]);

  return (
    <main>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">Proyectos</h1>
          <p className="mt-2 text-lg text-[#7f7368]">Gestiona tus proyectos de diseño</p>
        </div>
        <Button className="gap-3" onClick={() => setOpen(true)}>
          <span className="text-xl">＋</span> Nuevo Proyecto
        </Button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar proyectos..."
        className="mt-8 w-full max-w-xl text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
      />

      <section className="mt-8 grid gap-4 lg:max-w-2xl">
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-2xl">
            <Card>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{project.name}</h3>
                <span className="rounded-full bg-[#cc7046] px-3 py-1 text-xs font-medium text-white">
                  {project.status ?? "Activo"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#73685d]">
                {project.street || ""} {project.city || ""} {project.postal_code || ""} {project.country || ""}
              </p>
              <p className="mt-3 text-sm text-[#73685d]">Inicio: {project.start_date || "Sin fecha"}</p>
            </Card>
          </Link>
        ))}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo Proyecto">
        <form ref={formRef} action={formAction} className="space-y-4">
          <FormField label="Nombre *" name="name" required />
          <FormField label="Estado" name="status" defaultValue="Activo" />
          <FormField label="Calle" name="street" />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Ciudad" name="city" />
            <FormField label="Código postal" name="postal_code" />
          </div>
          <FormField label="País" name="country" />
          <FormField label="Fecha inicio" name="start_date" type="date" />

          <label className="block text-sm text-[#73685d]">
            <span className="mb-2 block">Clientes asociados</span>
            <select
              name="client_ids"
              multiple
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
            {pending ? "Creando..." : "Crear Proyecto"}
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
