// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearEditorialDto, ActualizarEditorialDto, RespuestaEditorialDto } from './editorial.dto';
import { editorialRepositorio } from './editorial.repository';

export const editorialServicio = {
  obtenerTodos(): Promise<RespuestaEditorialDto[]> {
    return editorialRepositorio.obtenerTodos();
  },

  async obtenerPorId(id: string): Promise<RespuestaEditorialDto> {
    const editorial = await editorialRepositorio.obtenerPorId(id);
    if (!editorial) throw ApiError.noEncontrado('Editorial no encontrada');
    return editorial;
  },

  crear(data: CrearEditorialDto): Promise<RespuestaEditorialDto> {
    return editorialRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarEditorialDto): Promise<RespuestaEditorialDto> {
    await this.obtenerPorId(id);
    return editorialRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await editorialRepositorio.eliminar(id);
  },
};
