"use server";

import { revalidatePath } from "next/cache";

import { createClient, syncClientProjects } from "@/lib/supabase";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim() ?? null;
  const phone = formData.get("phone")?.toString().trim() ?? null;
  const street = formData.get("street")?.toString().trim() ?? null;
  const city = formData.get("city")?.toString().trim() ?? null;
  const postal_code = formData.get("postal_code")?.toString().trim() ?? null;
  const country = formData.get("country")?.toString().trim() ?? null;
  const projectIds = formData
    .getAll("project_ids")
    .map((item) => item.toString())
    .filter(Boolean);

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }

  const { data, error } = await createClient({ name, email, phone, street, city, postal_code, country });

  if (error || !data) {
    return { error: `Unable to create client: ${error ?? "Unknown error"}` };
  }

  const syncResult = await syncClientProjects(data.id, projectIds);

  if (syncResult.error) {
    return { error: `Unable to update client relationships: ${syncResult.error}` };
  }

  revalidatePath("/clients");
  revalidatePath("/");
  revalidatePath("/projects");
  return { success: true };
}
