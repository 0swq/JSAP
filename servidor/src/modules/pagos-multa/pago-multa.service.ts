// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearPagoMultaDto, ActualizarPagoMultaDto, RespuestaPagoMultaDto } from './pago-multa.dto';
import { pagoMultaRepositorio } from './pago-multa.repository';

export const pagoMultaServicio = {
  obtenerTodos(): Promise<RespuestaPagoMultaDto[]> {
    return pagoMultaRepositorio.obtenerTodos();
  },

  obtenerPorMulta(multaId: string): Promise<RespuestaPagoMultaDto[]> {
    return pagoMultaRepositorio.obtenerPorMulta(multaId);
  },

  async obtenerPorId(id: string): Promise<RespuestaPagoMultaDto> {
    const pago = await pagoMultaRepositorio.obtenerPorId(id);
    if (!pago) throw ApiError.noEncontrado('Pago de multa no encontrado');
    return pago;
  },

  crear(data: CrearPagoMultaDto): Promise<RespuestaPagoMultaDto> {
    return pagoMultaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarPagoMultaDto): Promise<RespuestaPagoMultaDto> {
    await this.obtenerPorId(id);
    return pagoMultaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await pagoMultaRepositorio.eliminar(id);
  },
};
