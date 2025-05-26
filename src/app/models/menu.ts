export interface MenuNode {
    id: number;
    nombre: string;
    url?: string; // Para el backend
    nivel: number;
    orden: number;
    hijos?: MenuNode[];
    habilitado: boolean;
    tipo: string;
    configDir?: string; // Para la navegación en Angular
    descripcion?: string;
  }
  
 export  interface ExampleFlatNode {
    expandable: boolean;
    nombre: string;
    nivel: number;
    id: number;
    configDir?: string; // Añade esto
  }
