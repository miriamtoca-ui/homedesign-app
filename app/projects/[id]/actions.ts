"use server";

import { revalidatePath } from "next/cache";

import { syncProjectClients, updateProject } from "@/lib/supabase";

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

  const clientIds = formData
    .getAll("client_ids")
    .map((item) => item.toString())
    .filter(Boolean);

  const relationResult = await syncProjectClients(id, clientIds);

  if (relationResult.error) {
    return { error: `Unable to update project relations: ${relationResult.error}` };
  }

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath("/clients");
  revalidatePath("/");

  return { success: true };
}
