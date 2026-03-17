"use server";

import { revalidatePath } from "next/cache";

import { createMaterial, createRoomMedia } from "@/lib/supabase";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function addMaterialAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get("project_id")?.toString();
  const roomId = formData.get("room_id")?.toString();

  if (!projectId || !roomId) {
    return { error: "Habitación no válida." };
  }

  const { error } = await createMaterial({
    room_id: roomId,
    supplier_id: formData.get("supplier_id")?.toString() || null,
    name: formData.get("name")?.toString().trim() || null,
    category: formData.get("category")?.toString().trim() || null,
    unit: formData.get("unit")?.toString().trim() || null,
    quantity: Number(formData.get("quantity")?.toString() || "0") || null,
    unit_price: Number(formData.get("unit_price")?.toString() || "0") || null,
    image_url: formData.get("image_url")?.toString().trim() || null,
    width: Number(formData.get("width")?.toString() || "0") || null,
    height: Number(formData.get("height")?.toString() || "0") || null,
    depth: Number(formData.get("depth")?.toString() || "0") || null,
  });

  if (error) {
    return { error: `Unable to create material: ${error}` };
  }

  revalidatePath(`/projects/${projectId}/rooms/${roomId}`);
  return { success: true };
}

export async function addRoomMediaAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get("project_id")?.toString();
  const roomId = formData.get("room_id")?.toString();

  if (!projectId || !roomId) {
    return { error: "Habitación no válida." };
  }

  const { error } = await createRoomMedia({
    room_id: roomId,
    media_type: (formData.get("media_type")?.toString() as "image" | "plan" | "render" | "reference") || "image",
    url: formData.get("url")?.toString().trim() || null,
  });

  if (error) {
    return { error: `Unable to add media: ${error}` };
  }

  revalidatePath(`/projects/${projectId}/rooms/${roomId}`);
  return { success: true };
}
