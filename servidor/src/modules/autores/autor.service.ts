// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearAutorDto, ActualizarAutorDto, RespuestaAutorDto } from './autor.dto';
import { autorRepositorio } from './autor.repository';

export const autorServicio = {
  obtenerTodos(): Promise<RespuestaAutorDto[]> {
    return autorRepositorio.obtenerTodos();
  },

  async obtenerPorId(id: string): Promise<RespuestaAutorDto> {
    const autor = await autorRepositorio.obtenerPorId(id);
    if (!autor) throw ApiError.noEncontrado('Autor no encontrado');
    return autor;
  },

  crear(data: CrearAutorDto): Promise<RespuestaAutorDto> {
    return autorRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarAutorDto): Promise<RespuestaAutorDto> {
    await this.obtenerPorId(id);
    return autorRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await autorRepositorio.eliminar(id);
  },
};
