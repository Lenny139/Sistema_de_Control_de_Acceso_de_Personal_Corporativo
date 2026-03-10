import { ReporteResult } from './ReporteResult';

export abstract class AbstractReporteGenerator<TInput, TOutput> {
  readonly generate = async (input: TInput): Promise<ReporteResult<TOutput>> => {
    const rawData = await this.obtenerDatos(input);
    const processedData = this.procesarDatos(rawData);
    const result = this.formatearResultado(processedData);

    return {
      tipo: this.getTipoReporte(),
      fechaGeneracion: new Date(),
      parametros: input as Record<string, unknown>,
      data: result,
      totalRegistros: Array.isArray(result) ? result.length : 1,
    };
  };

  protected abstract obtenerDatos(input: TInput): Promise<any>;
  protected abstract procesarDatos(rawData: any): any;
  protected abstract formatearResultado(processedData: any): TOutput;
  protected abstract getTipoReporte(): string;
}
