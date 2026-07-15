// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearMultaDto, ActualizarMultaDto, RespuestaMultaDto } from './multa.dto';
import { multaRepositorio } from './multa.repository';

export const multaServicio = {
  obtenerTodos(filtros: any = {}): Promise<RespuestaMultaDto[]> {
    return multaRepositorio.obtenerTodos(filtros);
  },

  async obtenerPorId(id: string): Promise<RespuestaMultaDto> {
    const multa = await multaRepositorio.obtenerPorId(id);
    if (!multa) throw ApiError.noEncontrado('Multa no encontrada');
    return multa;
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaMultaDto[]> {
    return multaRepositorio.obtenerPorUsuario(usuarioId);
  },

  crear(data: CrearMultaDto): Promise<RespuestaMultaDto> {
    return multaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarMultaDto): Promise<RespuestaMultaDto> {
    if (!await multaRepositorio.obtenerPorId(id)) throw ApiError.noEncontrado('Multa no encontrada');
    return multaRepositorio.actualizar(id, data);
  },
};
