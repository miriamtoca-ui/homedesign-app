import type { Metadata } from "next";

import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudio Interior",
  description: "Panel de gestión para estudio de interiorismo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-[#efe9e1] text-[#2f2821] antialiased">
        <div className="min-h-screen md:flex">
          <Sidebar />
          <div className="flex-1 border border-[#ddd4ca] bg-[#f5f1ec]">
            <header className="h-[68px] border-b border-[#ddd4ca] px-7 py-5">
              <div className="h-7 w-7 rounded border border-[#8d8378]" aria-hidden="true" />
            </header>
            <div className="px-8 py-8 md:px-10">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
