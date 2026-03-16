"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  const { error } = await createClient({ name, email });

  if (error) {
    return { error: `Unable to create client: ${error}` };
  }

  revalidatePath("/clients");
  return { success: true };
}
