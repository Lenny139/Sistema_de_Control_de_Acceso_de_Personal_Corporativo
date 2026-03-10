import { CreateEmpleadoDto } from './CreateEmpleadoDto';

export type UpdateEmpleadoDto = Partial<CreateEmpleadoDto & { activo: boolean }>;
