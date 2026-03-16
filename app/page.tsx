import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">Home Design App</h1>
        <p className="mt-3 text-zinc-600">Manage your project clients from a dedicated page.</p>

        <Link
          href="/clients"
          className="mt-6 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Go to clients
        </Link>
      </div>
    </main>
  );
}
