const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export type ClientRecord = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
};

export async function listClients() {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/clients?select=id,name,email,created_at&order=created_at.desc`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        data: [] as ClientRecord[],
        error: await response.text(),
      };
    }

    return {
      data: (await response.json()) as ClientRecord[],
      error: null,
    };
  } catch {
    return {
      data: [] as ClientRecord[],
      error: "Unable to reach Supabase. Check environment variables and network access.",
    };
  }
}

export async function createClient(input: Pick<ClientRecord, "name" | "email">) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return { error: await response.text() };
    }

    return { error: null };
  } catch {
    return { error: "Unable to reach Supabase. Check environment variables and network access." };
  }
}
