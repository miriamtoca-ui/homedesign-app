export type ClientRecord = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

type ClientsResult = {
  data: ClientRecord[];
  error: string | null;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

function parseErrorMessage(errorBody: string) {
  try {
    const parsed = JSON.parse(errorBody) as { message?: string };
    return parsed.message ?? errorBody;
  } catch {
    return errorBody;
  }
}

export async function listClients(): Promise<ClientsResult> {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      data: [],
      error: "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const response = await fetch(
      `${config.supabaseUrl}/rest/v1/clients?select=id,name,email,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        data: [],
        error: parseErrorMessage(await response.text()),
      };
    }

    return {
      data: (await response.json()) as ClientRecord[],
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "Unable to reach Supabase. Check environment variables and network access.",
    };
  }
}

export async function createClient(input: Pick<ClientRecord, "name" | "email">) {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      error: "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/clients`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return { error: parseErrorMessage(await response.text()) };
    }

    return { error: null };
  } catch {
    return { error: "Unable to reach Supabase. Check environment variables and network access." };
  }
}
