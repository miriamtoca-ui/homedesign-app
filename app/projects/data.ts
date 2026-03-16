export type ProjectDetail = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  status: "Activo" | "Inactivo";
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  rooms: string[];
  clientIds: string[];
  clientNames: string[];
};

export const projectCatalog: ProjectDetail[] = [
  {
    id: "1",
    name: "Casa amarilla",
    description: "Chalet en Mirasierra amarilla necesitada de reforma integral",
    startDate: "28/3/2026",
    status: "Activo",
    address: {
      street: "Calle Monasterio de Silos 30",
      city: "Madrid",
      postalCode: "28049",
      country: "España",
    },
    rooms: ["Salón", "Dormitorio principal", "Cocina"],
    clientIds: [],
    clientNames: [],
  },
];
