"use server";

import { revalidatePath } from "next/cache";

import {
  createClient,
  createRoom,
  setPrimaryContact,
  syncProjectClients,
  updateProject,
} from "@/lib/supabase";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function updateProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!id || !name) {
    return { error: "Faltan campos obligatorios." };
  }

  const payload = {
    name,
    status: formData.get("status")?.toString().trim() ?? "Activo",
    street: formData.get("street")?.toString().trim() ?? null,
    city: formData.get("city")?.toString().trim() ?? null,
    postal_code: formData.get("postal_code")?.toString().trim() ?? null,
    country: formData.get("country")?.toString().trim() ?? null,
    start_date: formData.get("start_date")?.toString().trim() ?? null,
  };

  const { error } = await updateProject(id, payload);

  if (error) {
    return { error: `Unable to update project: ${error}` };
  }

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath("/");

  return { success: true };
}

export async function updateProjectClientsAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get("project_id")?.toString();

  if (!projectId) {
    return { error: "Proyecto no válido." };
  }

  const clientIds = formData
    .getAll("client_ids")
    .map((item) => item.toString())
    .filter(Boolean);

  const relationResult = await syncProjectClients(projectId, clientIds);

  if (relationResult.error) {
    return { error: `Unable to update project relations: ${relationResult.error}` };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/clients");

  return { success: true };
}

export async function createClientForProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get("project_id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!projectId || !name) {
    return { error: "Faltan campos obligatorios." };
  }

  const { data, error } = await createClient({
    name,
    email: formData.get("email")?.toString().trim() ?? null,
    phone: formData.get("phone")?.toString().trim() ?? null,
    street: formData.get("street")?.toString().trim() ?? null,
    city: formData.get("city")?.toString().trim() ?? null,
    postal_code: formData.get("postal_code")?.toString().trim() ?? null,
    country: formData.get("country")?.toString().trim() ?? null,
  });

  if (error || !data) {
    return { error: `Unable to create client: ${error ?? "Unknown error"}` };
  }

  const relationResult = await syncProjectClients(projectId, [data.id]);

  if (relationResult.error) {
    return { error: `Unable to link client to project: ${relationResult.error}` };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/clients");

  return { success: true };
}

export async function setPrimaryContactAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get("project_id")?.toString();
  const linkId = formData.get("link_id")?.toString() ?? null;

  if (!projectId) {
    return { error: "Proyecto no válido." };
  }

  const result = await setPrimaryContact(projectId, linkId);

  if (result.error) {
    return { error: `Unable to set primary contact: ${result.error}` };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  return { success: true };
}

export async function addRoomAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get("project_id")?.toString();

  if (!projectId) {
    return { error: "Proyecto no válido." };
  }

  const { error } = await createRoom({
    project_id: projectId,
    name: formData.get("name")?.toString().trim() ?? null,
    type: formData.get("type")?.toString().trim() ?? null,
    area_m2: Number(formData.get("area_m2")?.toString() || "0") || null,
    width_m: Number(formData.get("width_m")?.toString() || "0") || null,
    length_m: Number(formData.get("length_m")?.toString() || "0") || null,
    height_m: Number(formData.get("height_m")?.toString() || "0") || null,
  });

  if (error) {
    return { error: `Unable to add room: ${error}` };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}
