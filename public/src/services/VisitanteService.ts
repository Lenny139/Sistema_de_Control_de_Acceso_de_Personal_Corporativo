import { ApiClient } from '../core/ApiClient.js';
import { Visitante } from '../models/Visitante.model.js';

export interface RegistrarVisitantePayload {
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  empresa?: string;
  empleadoAnfitrionId: string;
  puntoControlId: string;
  observaciones?: string;
}

export class VisitanteService {
  private readonly api = new ApiClient();

  public getTodos(): Promise<Visitante[]> {
    return this.api.get<Visitante[]>('/visitors');
  }

  public getPresentes(): Promise<Visitante[]> {
    return this.api.get<Visitante[]>('/visitors/presentes');
  }

  public registrarEntrada(payload: RegistrarVisitantePayload): Promise<Visitante> {
    return this.api.post<Visitante>('/visitors/check-in', payload);
  }

  public registrarSalida(visitanteId: string): Promise<Visitante> {
    return this.api.post<Visitante>('/visitors/check-out', { visitanteId });
  }
}
