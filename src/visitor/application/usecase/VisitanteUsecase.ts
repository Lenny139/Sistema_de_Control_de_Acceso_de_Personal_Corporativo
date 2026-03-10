import { RegistrarVisitanteDto } from '../../domain/model/RegistrarVisitanteDto';
import { Visitante } from '../../domain/model/Visitante';
import { VisitanteServicePort } from '../../domain/port/driver/service/VisitanteServicePort';
import { VisitanteUsecasePort } from './VisitanteUsecasePort';

export class VisitanteUsecase implements VisitanteUsecasePort {
  constructor(private readonly visitanteService: VisitanteServicePort) {}

  async registrarEntrada(dto: RegistrarVisitanteDto & { guardiaId: string }): Promise<Visitante> {
    return this.visitanteService.registrarEntradaVisitante(dto);
  }

  async registrarSalida(visitanteId: string, guardiaId: string): Promise<Visitante> {
    return this.visitanteService.registrarSalidaVisitante(visitanteId, guardiaId);
  }

  async getPresentes(): Promise<Visitante[]> {
    return this.visitanteService.getVisitantesPresentes();
  }

  async getHistorial(fechaInicio: string, fechaFin: string): Promise<Visitante[]> {
    return this.visitanteService.getHistorialVisitantes(fechaInicio, fechaFin);
  }

  async getById(id: string): Promise<Visitante> {
    return this.visitanteService.getVisitanteById(id);
  }
}
