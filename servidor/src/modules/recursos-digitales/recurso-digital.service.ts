// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearRecursoDigitalDto, ActualizarRecursoDigitalDto, RespuestaRecursoDigitalDto } from './recurso-digital.dto';
import { recursoDigitalRepositorio } from './recurso-digital.repository';

export const recursoDigitalServicio = {
  obtenerTodos(): Promise<RespuestaRecursoDigitalDto[]> {
    return recursoDigitalRepositorio.obtenerTodos();
  },

  obtenerPorLibro(libroId: string): Promise<RespuestaRecursoDigitalDto[]> {
    return recursoDigitalRepositorio.obtenerPorLibro(libroId);
  },

  async obtenerPorId(id: string): Promise<RespuestaRecursoDigitalDto> {
    const recurso = await recursoDigitalRepositorio.obtenerPorId(id);
    if (!recurso) throw ApiError.noEncontrado('Recurso digital no encontrado');
    return recurso;
  },

  crear(data: CrearRecursoDigitalDto): Promise<RespuestaRecursoDigitalDto> {
    return recursoDigitalRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarRecursoDigitalDto): Promise<RespuestaRecursoDigitalDto> {
    await this.obtenerPorId(id);
    return recursoDigitalRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await recursoDigitalRepositorio.eliminar(id);
  },
};
