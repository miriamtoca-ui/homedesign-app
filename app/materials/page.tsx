import { Card } from "@/components/ui/card";
import { listMaterialsCatalog } from "@/lib/supabase";

export default async function MaterialsPage() {
  const { data: materials } = await listMaterialsCatalog();

  return (
    <main className="space-y-8">
      <section>
        <h1 className="font-[Georgia,serif] text-4xl font-normal text-[#2a221b]">Materials</h1>
        <p className="mt-2 text-sm text-[#73685d]">Global catalog for reusable room materials.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {materials.map((material) => (
          <Card key={material.id}>
            <h2 className="font-[Georgia,serif] text-2xl font-medium text-[#2c241d]">{material.name || "Material"}</h2>
            <p className="mt-2 text-sm text-[#73685d]">Category: {material.category || "-"}</p>
            <p className="text-sm text-[#73685d]">Supplier: {material.suppliers?.name || "-"}</p>
            <p className="text-sm text-[#73685d]">Unit price: {material.unit_price ?? 0}</p>
          </Card>
        ))}
        {materials.length === 0 ? (
          <Card>
            <p className="text-sm text-[#73685d]">Sin materiales</p>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
