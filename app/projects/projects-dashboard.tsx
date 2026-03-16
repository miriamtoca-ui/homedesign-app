"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
};

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Casa amarilla",
    description: "Chalet en Mirasierra amarilla necesitada de reforma integral",
    startDate: "28/3/2026",
  },
];

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
          <h1 className="font-[Georgia,serif] text-6xl font-semibold text-[#2a221b] md:text-7xl">Proyectos</h1>
          <p className="mt-2 text-4xl text-[#7f7368] md:text-5xl">Gestiona tus proyectos de diseño</p>
        </div>
        <Button className="gap-3" onClick={() => setOpen(true)}>
          <span className="text-xl">＋</span> Nuevo Proyecto
        </Button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar proyectos..."
        className="mt-8 w-full max-w-xl rounded-xl border border-[#ddd4ca] bg-[#f7f3ee] px-5 py-3 text-3xl text-[#594f45] placeholder:text-[#8a7d70] focus:border-[#c8673b] focus:outline-none"
      />

      <section className="mt-8 grid gap-4 lg:max-w-2xl">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-[Georgia,serif] text-5xl font-semibold text-[#2c241d]">{project.name}</h3>
              <span className="rounded-full bg-[#cc7046] px-4 py-1 text-xl font-semibold text-white">Activo</span>
            </div>
            <p className="mt-3 text-3xl text-[#73685d]">{project.description}</p>
            <p className="mt-3 text-3xl text-[#73685d]">Inicio: {project.startDate}</p>
          </Card>
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
    <label className="block text-3xl text-[#3f372f]">
      <span className="mb-2 block">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          className="w-full rounded-xl border border-[#ddd4ca] bg-[#f7f3ee] px-4 py-3 text-2xl focus:border-[#c8673b] focus:outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full rounded-xl border border-[#ddd4ca] bg-[#f7f3ee] px-4 py-3 text-2xl focus:border-[#c8673b] focus:outline-none"
        />
      )}
    </label>
  );
}
