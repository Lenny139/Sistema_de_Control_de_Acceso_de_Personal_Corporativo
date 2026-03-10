import { RegistrarVisitanteDto } from '../../domain/model/RegistrarVisitanteDto';
import { Visitante } from '../../domain/model/Visitante';

export interface VisitanteUsecasePort {
  registrarEntrada(dto: RegistrarVisitanteDto & { guardiaId: string }): Promise<Visitante>;
  registrarSalida(visitanteId: string, guardiaId: string): Promise<Visitante>;
  getPresentes(): Promise<Visitante[]>;
  getHistorial(fechaInicio: string, fechaFin: string): Promise<Visitante[]>;
  getById(id: string): Promise<Visitante>;
}
