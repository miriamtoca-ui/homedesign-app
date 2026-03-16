"use server";

import { revalidatePath } from "next/cache";

import { syncClientProjects, updateClient } from "@/lib/supabase";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function updateClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!id || !name) {
    return { error: "Faltan campos obligatorios." };
  }

  const payload = {
    name,
    email: formData.get("email")?.toString().trim() ?? null,
    phone: formData.get("phone")?.toString().trim() ?? null,
    street: formData.get("street")?.toString().trim() ?? null,
    city: formData.get("city")?.toString().trim() ?? null,
    postal_code: formData.get("postal_code")?.toString().trim() ?? null,
    country: formData.get("country")?.toString().trim() ?? null,
  };

  const { error } = await updateClient(id, payload);

  if (error) {
    return { error: `Unable to update client: ${error}` };
  }

  const projectIds = formData
    .getAll("project_ids")
    .map((item) => item.toString())
    .filter(Boolean);

  const relationResult = await syncClientProjects(id, projectIds);

  if (relationResult.error) {
    return { error: `Unable to update project relations: ${relationResult.error}` };
  }

  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
  revalidatePath("/projects");
  revalidatePath("/");

  return { success: true };
}
