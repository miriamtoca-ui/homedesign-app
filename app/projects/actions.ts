"use server";

import { revalidatePath } from "next/cache";

import { createProject, syncProjectClients } from "@/lib/supabase";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const status = formData.get("status")?.toString().trim() ?? "Activo";
  const street = formData.get("street")?.toString().trim() ?? null;
  const city = formData.get("city")?.toString().trim() ?? null;
  const postal_code = formData.get("postal_code")?.toString().trim() ?? null;
  const country = formData.get("country")?.toString().trim() ?? null;
  const start_date = formData.get("start_date")?.toString().trim() ?? null;
  const clientIds = formData
    .getAll("client_ids")
    .map((item) => item.toString())
    .filter(Boolean);

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }

  const { data, error } = await createProject({
    name,
    status,
    street,
    city,
    postal_code,
    country,
    start_date,
  });

  if (error || !data) {
    return { error: `Unable to create project: ${error ?? "Unknown error"}` };
  }

  const syncResult = await syncProjectClients(data.id, clientIds);

  if (syncResult.error) {
    return { error: `Unable to update project relationships: ${syncResult.error}` };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/clients");
  return { success: true };
}
