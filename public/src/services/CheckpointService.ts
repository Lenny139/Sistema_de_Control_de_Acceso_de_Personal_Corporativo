import { ApiClient } from '../core/ApiClient.js';

export interface Checkpoint {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export class CheckpointService {
  private readonly api = new ApiClient();

  public getAll(): Promise<Checkpoint[]> {
    return this.api.get<Checkpoint[]>('/checkpoints');
  }

  public getActivos(): Promise<Checkpoint[]> {
    return this.api.get<Checkpoint[]>('/checkpoints?activo=true');
  }

  public create(data: { nombre: string; descripcion?: string }): Promise<Checkpoint> {
    return this.api.post<Checkpoint>('/checkpoints', data);
  }

  public update(id: string, data: Partial<Checkpoint>): Promise<Checkpoint> {
    return this.api.put<Checkpoint>(`/checkpoints/${id}`, data);
  }

  public delete(id: string): Promise<void> {
    return this.api.delete<void>(`/checkpoints/${id}`);
  }
}
