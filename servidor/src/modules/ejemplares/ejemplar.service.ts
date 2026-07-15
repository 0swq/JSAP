// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearEjemplarDto, ActualizarEjemplarDto, RespuestaEjemplarDto } from './ejemplar.dto';
import { ejemplarRepositorio } from './ejemplar.repository';

export const ejemplarServicio = {
  obtenerTodos(): Promise<RespuestaEjemplarDto[]> {
    return ejemplarRepositorio.obtenerTodos();
  },

  obtenerPorLibro(libroId: string): Promise<RespuestaEjemplarDto[]> {
    return ejemplarRepositorio.obtenerPorLibro(libroId);
  },

  async obtenerPorId(id: string): Promise<RespuestaEjemplarDto> {
    const ejemplar = await ejemplarRepositorio.obtenerPorId(id);
    if (!ejemplar) throw ApiError.noEncontrado('Ejemplar no encontrado');
    return ejemplar;
  },

  crear(data: CrearEjemplarDto): Promise<RespuestaEjemplarDto> {
    return ejemplarRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarEjemplarDto): Promise<RespuestaEjemplarDto> {
    await this.obtenerPorId(id);
    return ejemplarRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await ejemplarRepositorio.eliminar(id);
  },
};
