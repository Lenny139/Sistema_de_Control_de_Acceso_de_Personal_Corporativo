import { Request, Response } from 'express';
import { ControllerBase } from '../../../api/infrastructure/http/ControllerBase';
import { Role } from '../../../auth/domain/entities/Role';
import { DomainError } from '../../../shared/domain/errors/DomainError';
import { EmpleadoServicePort } from '../../application/ports/EmpleadoServicePort';

export class EmpleadoController extends ControllerBase {
  constructor(private readonly service: EmpleadoServicePort) {
    super();
  }

  readonly execute = async (req: Request, res: Response): Promise<void> => {
    if (req.method === 'GET') {
      const empleados = await this.service.getAll();
      res.status(200).json(
        empleados.map((empleado) => ({
          id: empleado.getId(),
          nombre: empleado.getNombre(),
          username: empleado.getUsername(),
          role: empleado.getRole(),
        })),
      );
      return;
    }

    try {
      const { id, nombre, username, password, role } = req.body as {
        id: string;
        nombre: string;
        username: string;
        password: string;
        role: Role;
      };

      await this.service.create({ id, nombre, username, password, role });
      res.status(201).json({ message: 'Empleado creado correctamente' });
    } catch (error) {
      const message = error instanceof DomainError ? error.message : 'Error interno';
      res.status(400).json({ message });
    }
  };
}
