"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "Panel", icon: PanelIcon },
  { href: "/clients", label: "Clientes", icon: ClientsIcon },
  { href: "/projects", label: "Proyectos", icon: ProjectsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-[#ddd4ca] bg-[#f3eee7] p-4 md:w-[310px] md:p-6">
      <h1 className="mb-10 font-[Georgia,serif] text-5xl font-semibold text-[#211a13] md:text-4xl">Estudio Interior</h1>
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#7b6f61]">Menú</p>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-2xl transition md:text-3xl ${
                active ? "bg-[#ece5dd] text-[#c8673b]" : "text-[#3f372f] hover:bg-[#ece5dd]"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[0.75em] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function PanelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function ClientsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="7" r="2.5" />
      <path d="M3.5 19c.8-2.7 2.8-4 4.5-4h0c1.7 0 3.8 1.3 4.5 4" />
      <path d="M13 18c.6-1.8 1.8-2.8 3-2.8 1.3 0 2.4 1 3 2.8" />
    </svg>
  );
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H10l2 2h6.5A2.5 2.5 0 0 1 21 10.5v7A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
    </svg>
  );
}
