export abstract class ReporteTemplateMethod {
  readonly generar = async (): Promise<unknown> => {
    const data = await this.obtenerDatos();
    const procesado = this.procesarDatos(data);
    return this.formatearSalida(procesado);
  };

  protected abstract obtenerDatos(): Promise<unknown[]>;
  protected abstract procesarDatos(data: unknown[]): unknown[];
  protected abstract formatearSalida(data: unknown[]): unknown;
}
