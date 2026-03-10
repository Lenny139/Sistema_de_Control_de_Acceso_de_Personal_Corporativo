import { RegistrarVisitanteDto } from '../../../../domain/model/RegistrarVisitanteDto';
import { Visitante } from '../../../../domain/model/Visitante';

export interface VisitanteServicePort {
  registrarEntradaVisitante(dto: RegistrarVisitanteDto & { guardiaId: string }): Promise<Visitante>;
  registrarSalidaVisitante(visitanteId: string, guardiaId: string): Promise<Visitante>;
  getVisitantesPresentes(): Promise<Visitante[]>;
  getHistorialVisitantes(fechaInicio: string, fechaFin: string): Promise<Visitante[]>;
  getVisitanteById(id: string): Promise<Visitante>;
}
