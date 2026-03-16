"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import type { ClientRecord, ProjectWithRelations } from "@/lib/supabase";

import {
  addRoomAction,
  createClientForProjectAction,
  setPrimaryContactAction,
  updateProjectAction,
  updateProjectClientsAction,
} from "./actions";

type ActionState = {
  error?: string;
  success?: boolean;
};

const initialState: ActionState = {};
const tabs = ["information", "clients", "rooms", "budget"] as const;
type WorkspaceTab = (typeof tabs)[number];

export function ProjectDetail({ project, allClients }: { project: ProjectWithRelations; allClients: ClientRecord[] }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("information");
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [manageClientsOpen, setManageClientsOpen] = useState(false);
  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);

  const [editState, editFormAction, editPending] = useActionState(updateProjectAction, initialState);
  const [manageClientState, manageClientAction, manageClientPending] = useActionState(
    updateProjectClientsAction,
    initialState,
  );
  const [createClientState, createClientAction, createClientPending] = useActionState(
    createClientForProjectAction,
    initialState,
  );
  const [primaryState, primaryAction, primaryPending] = useActionState(setPrimaryContactAction, initialState);
  const [roomState, roomAction, roomPending] = useActionState(addRoomAction, initialState);

  const selectedClientIds = project.project_clients.map((relation) => relation.client_id);

  const budgetItemsByRoom = new Map<string, typeof project.budgets[number]["budget_items"]>();
  for (const budget of project.budgets) {
    for (const item of budget.budget_items) {
      const roomKey = item.rooms?.name ?? "Sin habitación";
      const current = budgetItemsByRoom.get(roomKey) ?? [];
      budgetItemsByRoom.set(roomKey, [...current, item]);
    }
  }

  return (
    <main className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">{project.name}</h1>
          <p className="mt-2 text-sm text-[#73685d]">Estado: {project.status ?? "Activo"}</p>
          <p className="mt-1 text-sm text-[#73685d]">
            {project.street || ""} {project.city || ""} {project.postal_code || ""} {project.country || ""}
          </p>
        </div>
        <Button onClick={() => setEditProjectOpen(true)}>Editar proyecto</Button>
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === tab ? "bg-[#cc7046] text-white" : "bg-[#ece5dd] text-[#73685d]"
            }`}
            type="button"
          >
            {tab === "information" ? "Information" : tab === "clients" ? "Clients" : tab === "rooms" ? "Rooms" : "Budget"}
          </button>
        ))}
      </div>

      {activeTab === "information" ? (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Información</h2>
            <Button onClick={() => setEditProjectOpen(true)}>Editar</Button>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-[#73685d] md:grid-cols-2">
            <p>Nombre: {project.name}</p>
            <p>Estado: {project.status ?? "Activo"}</p>
            <p>Calle: {project.street || ""}</p>
            <p>Ciudad: {project.city || ""}</p>
            <p>Código postal: {project.postal_code || ""}</p>
            <p>País: {project.country || ""}</p>
            <p>Fecha inicio: {project.start_date || "Sin fecha"}</p>
          </div>
        </Card>
      ) : null}

      {activeTab === "clients" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setManageClientsOpen(true)}>Add existing client</Button>
            <Button onClick={() => setCreateClientOpen(true)}>Create new client</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {project.project_clients.map((relation) => (
              <Card key={relation.id}>
                <h3 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">
                  {relation.clients?.name ?? "Cliente"}
                </h3>
                <p className="mt-3 text-sm text-[#73685d]">{relation.clients?.email || "Sin email"}</p>
                <p className="mt-1 text-sm text-[#73685d]">{relation.clients?.phone || "Sin teléfono"}</p>
                <form action={primaryAction} className="mt-3">
                  <input type="hidden" name="project_id" value={project.id} />
                  <input type="hidden" name="link_id" value={relation.id} />
                  <Button type="submit" disabled={primaryPending}>
                    {relation.is_primary_contact ? "Primary contact" : "Mark primary contact"}
                  </Button>
                </form>
              </Card>
            ))}
            {project.project_clients.length === 0 ? (
              <Card>
                <p className="text-sm text-[#73685d]">Sin clientes asociados</p>
              </Card>
            ) : null}
          </div>
          {primaryState.error ? <p className="text-sm text-red-700">{primaryState.error}</p> : null}
        </div>
      ) : null}

      {activeTab === "rooms" ? (
        <div className="space-y-4">
          <Button onClick={() => setAddRoomOpen(true)}>Add room</Button>
          <div className="grid gap-4 md:grid-cols-2">
            {project.rooms.map((room) => (
              <Link key={room.id} href={`/projects/${project.id}/rooms/${room.id}`} className="block rounded-2xl">
                <Card>
                  <h3 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{room.name || "Habitación"}</h3>
                  <p className="mt-2 text-sm text-[#73685d]">Tipo: {room.type || "Sin tipo"}</p>
                  <p className="mt-1 text-sm text-[#73685d]">Área: {room.area_m2 ?? "-"} m²</p>
                  <p className="mt-1 text-sm text-[#73685d]">
                    Dimensiones: {room.width_m ?? "-"} × {room.length_m ?? "-"} × {room.height_m ?? "-"} m
                  </p>
                </Card>
              </Link>
            ))}
            {project.rooms.length === 0 ? (
              <Card>
                <p className="text-sm text-[#73685d]">Sin habitaciones</p>
              </Card>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeTab === "budget" ? (
        <div className="space-y-4">
          {project.budgets.map((budget, index) => (
            <Card key={budget.id}>
              <h3 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">
                {budget.version || `Budget v${index + 1}`}
              </h3>
              {budgetItemsByRoom.size === 0 ? (
                <p className="mt-3 text-sm text-[#73685d]">Sin partidas de presupuesto</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {Array.from(budgetItemsByRoom.entries()).map(([roomName, items]) => (
                    <div key={roomName}>
                      <p className="text-sm text-[#73685d]">{roomName}</p>
                      <ul className="mt-1 space-y-1 text-sm text-[#73685d]">
                        {items.map((item) => (
                          <li key={item.id}>
                            {item.description || "Item"} · {item.quantity ?? 0} × {item.unit_price ?? 0}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
          {project.budgets.length === 0 ? (
            <Card>
              <p className="text-sm text-[#73685d]">Sin presupuestos</p>
            </Card>
          ) : null}
        </div>
      ) : null}

      <Modal open={editProjectOpen} onClose={() => setEditProjectOpen(false)} title="Editar proyecto">
        <form action={editFormAction} className="space-y-4">
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

          {editState.error ? <p className="text-sm text-red-700">{editState.error}</p> : null}
          <Button type="submit" disabled={editPending} className="w-full">
            {editPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Modal>

      <Modal open={manageClientsOpen} onClose={() => setManageClientsOpen(false)} title="Add existing client">
        <form action={manageClientAction} className="space-y-4">
          <input type="hidden" name="project_id" value={project.id} />
          <label className="block text-sm text-[#73685d]">
            <span className="mb-2 block">Clientes asociados</span>
            <select
              name="client_ids"
              multiple
              defaultValue={selectedClientIds}
              className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 focus:border-[#6b8fa3] focus:outline-none"
            >
              {allClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          {manageClientState.error ? <p className="text-sm text-red-700">{manageClientState.error}</p> : null}
          <Button type="submit" disabled={manageClientPending} className="w-full">
            {manageClientPending ? "Guardando..." : "Guardar clientes"}
          </Button>
        </form>
      </Modal>

      <Modal open={createClientOpen} onClose={() => setCreateClientOpen(false)} title="Create new client">
        <form action={createClientAction} className="space-y-4">
          <input type="hidden" name="project_id" value={project.id} />
          <FormField label="Nombre *" name="name" required />
          <FormField label="Email" name="email" type="email" />
          <FormField label="Teléfono" name="phone" />
          <FormField label="Calle" name="street" />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Ciudad" name="city" />
            <FormField label="Código postal" name="postal_code" />
          </div>
          <FormField label="País" name="country" />
          {createClientState.error ? <p className="text-sm text-red-700">{createClientState.error}</p> : null}
          <Button type="submit" disabled={createClientPending} className="w-full">
            {createClientPending ? "Creando..." : "Crear cliente"}
          </Button>
        </form>
      </Modal>

      <Modal open={addRoomOpen} onClose={() => setAddRoomOpen(false)} title="Add room">
        <form action={roomAction} className="space-y-4">
          <input type="hidden" name="project_id" value={project.id} />
          <FormField label="Nombre" name="name" />
          <FormField label="Tipo" name="type" />
          <FormField label="Área m²" name="area_m2" type="number" />
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Ancho m" name="width_m" type="number" />
            <FormField label="Largo m" name="length_m" type="number" />
            <FormField label="Alto m" name="height_m" type="number" />
          </div>
          {roomState.error ? <p className="text-sm text-red-700">{roomState.error}</p> : null}
          <Button type="submit" disabled={roomPending} className="w-full">
            {roomPending ? "Guardando..." : "Guardar habitación"}
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
