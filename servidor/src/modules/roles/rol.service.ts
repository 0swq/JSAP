// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearRolDto, ActualizarRolDto, RespuestaRolDto } from './rol.dto';
import { rolRepositorio } from './rol.repository';

export const rolServicio = {
  obtenerTodos(): Promise<RespuestaRolDto[]> {
    return rolRepositorio.obtenerTodos();
  },

  async obtenerPorId(id: string): Promise<RespuestaRolDto> {
    const rol = await rolRepositorio.obtenerPorId(id);
    if (!rol) throw ApiError.noEncontrado('Rol no encontrado');
    return rol;
  },

  crear(data: CrearRolDto): Promise<RespuestaRolDto> {
    return rolRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarRolDto): Promise<RespuestaRolDto> {
    await this.obtenerPorId(id);
    return rolRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await rolRepositorio.eliminar(id);
  },
};
