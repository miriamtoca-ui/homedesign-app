import { Card } from "@/components/ui/card";
import { listClients } from "@/lib/supabase";

const statsMeta = [
  { key: "clients", label: "Clientes", icon: "⍟" },
  { key: "projects", label: "Proyectos", icon: "⌂" },
  { key: "rooms", label: "Habitaciones", icon: "▢" },
  { key: "budgets", label: "Presupuestos", icon: "$" },
] as const;

export default async function DashboardPage() {
  const { data: clients } = await listClients();

  const stats: Record<(typeof statsMeta)[number]["key"], number> = {
    clients: clients.length,
    projects: 0,
    rooms: 0,
    budgets: 0,
  };

  return (
    <main>
      <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">Panel de Control</h1>
      <p className="mt-2 text-lg text-[#7f7368]">Resumen general del estudio</p>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statsMeta.map((stat) => (
          <Card key={stat.key}>
            <div className="flex items-start justify-between text-[#72675c]">
              <p className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{stat.label}</p>
              <span className="text-sm text-[#c8673b]">{stat.icon}</span>
            </div>
            <p className="mt-6 font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{stats[stat.key]}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
