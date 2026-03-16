"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

import { projectCatalog, type ProjectDetail } from "./data";

type Project = Pick<ProjectDetail, "id" | "name" | "description" | "startDate" | "status">;

const initialProjects: Project[] = projectCatalog.map((project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  startDate: project.startDate,
  status: project.status,
}));

export function ProjectsDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.startDate.toLowerCase().includes(term),
    );
  }, [projects, search]);

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
                <span className="rounded-full bg-[#cc7046] px-3 py-1 text-xs font-medium text-white">{project.status}</span>
              </div>
              <p className="mt-3 text-sm text-[#73685d]">{project.description}</p>
              <p className="mt-3 text-sm text-[#73685d]">Inicio: {project.startDate}</p>
            </Card>
          </Link>
        ))}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo Proyecto">
        <ProjectForm
          onCreate={(project) => {
            setProjects((prev) => [project, ...prev]);
            setOpen(false);
          }}
        />
      </Modal>
    </main>
  );
}

function ProjectForm({ onCreate }: { onCreate: (project: Project) => void }) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name")?.toString().trim();

        if (!name) {
          return;
        }

        const description = formData.get("description")?.toString().trim() ?? "";
        const startDate = formData.get("startDate")?.toString().trim() ?? "";

        onCreate({
          id: crypto.randomUUID(),
          name,
          description,
          startDate,
          status: "Activo",
        });
      }}
    >
      <FormField label="Nombre *" name="name" required />
      <FormField label="Descripción" name="description" textarea />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Fecha inicio" name="startDate" type="date" />
        <FormField label="Fecha fin" name="endDate" type="date" />
      </div>
      <Button type="submit" className="w-full">
        Crear Proyecto
      </Button>
    </form>
  );
}

function FormField({
  label,
  name,
  required,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm text-[#73685d]">
      <span className="mb-2 block">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
        />
      )}
    </label>
  );
}
