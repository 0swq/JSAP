// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearCategoriaDto, ActualizarCategoriaDto, RespuestaCategoriaDto } from './categoria.dto';
import { categoriaRepositorio } from './categoria.repository';

export const categoriaServicio = {
  obtenerTodos(): Promise<RespuestaCategoriaDto[]> {
    return categoriaRepositorio.obtenerTodos();
  },

  async obtenerPorId(id: string): Promise<RespuestaCategoriaDto> {
    const categoria = await categoriaRepositorio.obtenerPorId(id);
    if (!categoria) throw ApiError.noEncontrado('Categoría no encontrada');
    return categoria;
  },

  crear(data: CrearCategoriaDto): Promise<RespuestaCategoriaDto> {
    return categoriaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarCategoriaDto): Promise<RespuestaCategoriaDto> {
    await this.obtenerPorId(id);
    return categoriaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await categoriaRepositorio.eliminar(id);
  },
};
