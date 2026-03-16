"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

import { createClientAction } from "./actions";

type ClientItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

type ActionState = {
  error?: string;
  success?: boolean;
};

const initialState: ActionState = {};

export function ClientsDashboard({ initialClients }: { initialClients: ClientItem[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [state, formAction, pending] = useActionState(createClientAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase();
    return initialClients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.phone ?? "").toLowerCase().includes(term) ||
        (client.address ?? "").toLowerCase().includes(term),
    );
  }, [initialClients, search]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">Clientes</h1>
          <p className="mt-2 text-lg text-[#7f7368]">Gestiona tus clientes</p>
        </div>
        <Button className="gap-3" onClick={() => setOpen(true)}>
          <span className="text-xl">＋</span> Nuevo Cliente
        </Button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar clientes..."
        className="mt-8 w-full max-w-xl text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {filteredClients.map((client) => (
          <Card key={client.id}>
            <h3 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{client.name}</h3>
            <p className="mt-3 text-sm text-[#73685d]">✉ {client.email || "Sin email"}</p>
            <p className="mt-1 text-sm text-[#73685d]">☎ {client.phone || "Sin teléfono"}</p>
            <p className="mt-1 text-sm text-[#73685d]">⌖ {client.address || "Sin dirección"}</p>
          </Card>
        ))}

        {filteredClients.length === 0 ? (
          <Card className="lg:col-span-2">
            <p className="text-sm text-[#73685d]">No hay clientes que coincidan con la búsqueda.</p>
          </Card>
        ) : null}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo Cliente">
        <form ref={formRef} action={formAction} className="space-y-4">
          <FormField label="Nombre *" name="name" required />
          <FormField label="Email" name="email" type="email" />
          <FormField label="Teléfono" name="phone" />
          <FormField label="Dirección" name="address" />
          <FormField label="Notas" name="notes" textarea />

          {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Creando..." : "Crear Cliente"}
          </Button>
        </form>
      </Modal>
    </div>
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
