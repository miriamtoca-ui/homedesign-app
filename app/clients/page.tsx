import Link from "next/link";

import { ClientForm } from "./client-form";
import { listClients } from "@/lib/supabase";

export default async function ClientsPage() {
  const { data: clients, error } = await listClients();

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 bg-zinc-50 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900">Clients</h1>
        <Link href="/" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
          Back home
        </Link>
      </div>

      <ClientForm />

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Client list</h2>

        {error ? <p className="text-sm text-red-600">Unable to load clients: {error}</p> : null}

        {!error && clients.length === 0 ? (
          <p className="text-sm text-zinc-600">No clients found. Add your first client above.</p>
        ) : null}

        {!error && clients.length > 0 ? (
          <ul className="divide-y divide-zinc-200">
            {clients.map((client) => (
              <li key={client.id} className="py-3">
                <p className="font-medium text-zinc-900">{client.name}</p>
                <p className="text-sm text-zinc-600">{client.email}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
