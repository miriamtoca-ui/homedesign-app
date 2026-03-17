"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import type { RoomWorkspace } from "@/lib/supabase";

import { addMaterialAction, addRoomMediaAction } from "./actions";

type ActionState = { error?: string; success?: boolean };
const initialState: ActionState = {};

export function RoomWorkspaceView({
  projectId,
  room,
  suppliers,
}: {
  projectId: string;
  room: RoomWorkspace;
  suppliers: Array<{ id: string; name: string | null }>;
}) {
  const [materialOpen, setMaterialOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  const [materialState, materialAction, materialPending] = useActionState(addMaterialAction, initialState);
  const [mediaState, mediaAction, mediaPending] = useActionState(addRoomMediaAction, initialState);

  return (
    <main className="space-y-8">
      <section>
        <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">{room.name || "Habitación"}</h1>
        <p className="mt-2 text-sm text-[#73685d]">
          {room.type || "Sin tipo"} · {room.area_m2 ?? "-"} m²
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Materials</h2>
          <Button onClick={() => setMaterialOpen(true)}>Add material</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {room.materials.map((material) => (
            <Card key={material.id}>
              <h3 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{material.name || "Material"}</h3>
              <p className="mt-2 text-sm text-[#73685d]">Category: {material.category || "-"}</p>
              <p className="text-sm text-[#73685d]">Unit: {material.unit || "-"}</p>
              <p className="text-sm text-[#73685d]">Quantity: {material.quantity ?? 0}</p>
              <p className="text-sm text-[#73685d]">Unit price: {material.unit_price ?? 0}</p>
              <p className="text-sm text-[#73685d]">Supplier: {material.suppliers?.name || "-"}</p>
              <p className="text-sm text-[#73685d]">Image: {material.image_url || "-"}</p>
              <p className="text-sm text-[#73685d]">
                Size: {material.width ?? "-"} × {material.height ?? "-"} × {material.depth ?? "-"}
              </p>
            </Card>
          ))}
          {room.materials.length === 0 ? (
            <Card>
              <p className="text-sm text-[#73685d]">Sin materiales</p>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">Images</h2>
          <Button onClick={() => setMediaOpen(true)}>Upload image</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {room.room_media.map((media) => (
            <Card key={media.id}>
              <p className="text-sm text-[#73685d]">Type: {media.media_type || "image"}</p>
              <p className="mt-1 text-sm text-[#73685d] break-all">{media.url || "-"}</p>
            </Card>
          ))}
          {room.room_media.length === 0 ? (
            <Card>
              <p className="text-sm text-[#73685d]">Sin imágenes</p>
            </Card>
          ) : null}
        </div>
      </section>

      <Modal open={materialOpen} onClose={() => setMaterialOpen(false)} title="Add material">
        <form action={materialAction} className="space-y-4">
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="room_id" value={room.id} />
          <Field label="Name" name="name" />
          <Field label="Category" name="category" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Unit" name="unit" />
            <Field label="Quantity" name="quantity" type="number" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Unit price" name="unit_price" type="number" />
            <Field label="Image URL" name="image_url" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Width" name="width" type="number" />
            <Field label="Height" name="height" type="number" />
            <Field label="Depth" name="depth" type="number" />
          </div>
          <label className="block text-sm text-[#73685d]">
            <span className="mb-2 block">Supplier</span>
            <select
              name="supplier_id"
              className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 focus:border-[#6b8fa3] focus:outline-none"
            >
              <option value="">Sin proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name || "Proveedor"}
                </option>
              ))}
            </select>
          </label>
          {materialState.error ? <p className="text-sm text-red-700">{materialState.error}</p> : null}
          <Button type="submit" disabled={materialPending} className="w-full">
            {materialPending ? "Guardando..." : "Guardar material"}
          </Button>
        </form>
      </Modal>

      <Modal open={mediaOpen} onClose={() => setMediaOpen(false)} title="Upload image">
        <form action={mediaAction} className="space-y-4">
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="room_id" value={room.id} />
          <label className="block text-sm text-[#73685d]">
            <span className="mb-2 block">Type</span>
            <select
              name="media_type"
              className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 focus:border-[#6b8fa3] focus:outline-none"
            >
              <option value="image">image</option>
              <option value="plan">plan</option>
              <option value="render">render</option>
              <option value="reference">reference</option>
            </select>
          </label>
          <Field label="URL" name="url" />
          {mediaState.error ? <p className="text-sm text-red-700">{mediaState.error}</p> : null}
          <Button type="submit" disabled={mediaPending} className="w-full">
            {mediaPending ? "Guardando..." : "Guardar imagen"}
          </Button>
        </form>
      </Modal>
    </main>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block text-sm text-[#73685d]">
      <span className="mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
      />
    </label>
  );
}
