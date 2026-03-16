export type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
};

export type ProjectRecord = {
  id: string;
  name: string;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  status: string | null;
  start_date: string | null;
  created_at: string;
};

type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type ClientWithRelations = ClientRecord & {
  project_clients: Array<{
    project_id: string;
    projects: ProjectRecord | null;
  }>;
};

export type ProjectWithRelations = ProjectRecord & {
  project_clients: Array<{
    client_id: string;
    clients: ClientRecord | null;
  }>;
  rooms: Array<{
    id: string;
    name: string | null;
    type: string | null;
    area_m2: number | null;
  }>;
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

async function request(path: string, init?: RequestInit) {
  const config = getSupabaseConfig();

  if (!config) {
    return { response: null, error: "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  }

  try {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        ...(init?.headers ?? {}),
      },
      cache: init?.cache ?? "no-store",
    });

    if (!response.ok) {
      return { response: null, error: parseErrorMessage(await response.text()) };
    }

    return { response, error: null };
  } catch {
    return { response: null, error: "Unable to reach Supabase. Check environment variables and network access." };
  }
}

export async function listClients() {
  const select =
    "id,name,email,phone,street,city,postal_code,country,created_at,project_clients(project_id,projects(id,name,street,city,postal_code,country,status,start_date,created_at))";
  const { response, error } = await request(`clients?select=${encodeURIComponent(select)}&order=created_at.desc`);

  if (error || !response) {
    return { data: [] as ClientWithRelations[], error: error ?? "Unknown error" };
  }

  return { data: (await response.json()) as ClientWithRelations[], error: null };
}

export async function getClientById(id: string) {
  const select =
    "id,name,email,phone,street,city,postal_code,country,created_at,project_clients(project_id,projects(id,name,street,city,postal_code,country,status,start_date,created_at))";
  const { response, error } = await request(`clients?select=${encodeURIComponent(select)}&id=eq.${id}&limit=1`);

  if (error || !response) {
    return { data: null as ClientWithRelations | null, error: error ?? "Unknown error" };
  }

  const data = (await response.json()) as ClientWithRelations[];
  return { data: data[0] ?? null, error: null };
}

export async function createClient(input: Omit<ClientRecord, "id" | "created_at">) {
  const { response, error } = await request("clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(input),
  });

  if (error || !response) {
    return { data: null as ClientRecord | null, error: error ?? "Unknown error" };
  }

  const data = (await response.json()) as ClientRecord[];
  return { data: data[0] ?? null, error: null };
}

export async function updateClient(id: string, input: Omit<ClientRecord, "id" | "created_at">) {
  const { error } = await request(`clients?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(input),
  });

  return { error };
}

export async function listProjects() {
  const select =
    "id,name,street,city,postal_code,country,status,start_date,created_at,project_clients(client_id,clients(id,name,email,phone,street,city,postal_code,country,created_at))";
  const { response, error } = await request(`projects?select=${encodeURIComponent(select)}&order=created_at.desc`);

  if (error || !response) {
    return { data: [] as ProjectWithRelations[], error: error ?? "Unknown error" };
  }

  return { data: (await response.json()) as ProjectWithRelations[], error: null };
}

export async function getProjectById(id: string) {
  const select =
    "id,name,street,city,postal_code,country,status,start_date,created_at,project_clients(client_id,clients(id,name,email,phone,street,city,postal_code,country,created_at)),rooms(id,name,type,area_m2)";
  const { response, error } = await request(`projects?select=${encodeURIComponent(select)}&id=eq.${id}&limit=1`);

  if (error || !response) {
    return { data: null as ProjectWithRelations | null, error: error ?? "Unknown error" };
  }

  const data = (await response.json()) as ProjectWithRelations[];
  return { data: data[0] ?? null, error: null };
}

export async function createProject(input: Omit<ProjectRecord, "id" | "created_at">) {
  const { response, error } = await request("projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(input),
  });

  if (error || !response) {
    return { data: null as ProjectRecord | null, error: error ?? "Unknown error" };
  }

  const data = (await response.json()) as ProjectRecord[];
  return { data: data[0] ?? null, error: null };
}

export async function updateProject(id: string, input: Omit<ProjectRecord, "id" | "created_at">) {
  const { error } = await request(`projects?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(input),
  });

  return { error };
}

export async function syncProjectClients(projectId: string, clientIds: string[]) {
  const { response, error } = await request(`project_clients?select=id,client_id&project_id=eq.${projectId}`);

  if (error || !response) {
    return { error: error ?? "Unknown error" };
  }

  const current = (await response.json()) as Array<{ id: string; client_id: string }>;
  const currentIds = new Set(current.map((item) => item.client_id));
  const nextIds = new Set(clientIds);

  const toAdd = clientIds.filter((id) => !currentIds.has(id));
  const toDelete = current.filter((item) => !nextIds.has(item.client_id));

  if (toAdd.length > 0) {
    const payload = toAdd.map((clientId) => ({ project_id: projectId, client_id: clientId, role: null, is_primary_contact: false }));
    const insertResult = await request("project_clients", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    });

    if (insertResult.error) {
      return { error: insertResult.error };
    }
  }

  for (const item of toDelete) {
    const removeResult = await request(`project_clients?id=eq.${item.id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    if (removeResult.error) {
      return { error: removeResult.error };
    }
  }

  return { error: null };
}

export async function syncClientProjects(clientId: string, projectIds: string[]) {
  const { response, error } = await request(`project_clients?select=id,project_id&client_id=eq.${clientId}`);

  if (error || !response) {
    return { error: error ?? "Unknown error" };
  }

  const current = (await response.json()) as Array<{ id: string; project_id: string }>;
  const currentIds = new Set(current.map((item) => item.project_id));
  const nextIds = new Set(projectIds);

  const toAdd = projectIds.filter((id) => !currentIds.has(id));
  const toDelete = current.filter((item) => !nextIds.has(item.project_id));

  if (toAdd.length > 0) {
    const payload = toAdd.map((projectId) => ({ project_id: projectId, client_id: clientId, role: null, is_primary_contact: false }));
    const insertResult = await request("project_clients", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    });

    if (insertResult.error) {
      return { error: insertResult.error };
    }
  }

  for (const item of toDelete) {
    const removeResult = await request(`project_clients?id=eq.${item.id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    if (removeResult.error) {
      return { error: removeResult.error };
    }
  }

  return { error: null };
}
