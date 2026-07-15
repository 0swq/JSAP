// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearHistorialDto, RespuestaHistorialDto } from './historial.dto';
import { historialRepositorio } from './historial.repository';

export const historialServicio = {
  obtenerTodos(filtros: {
    hechoPorId?: string;
    modulo?: string;
    nombreAccion?: string;
    accion?: string;
    buscar?: string;
    desde?: Date;
    hasta?: Date;
  } = {}): Promise<RespuestaHistorialDto[]> {
    return historialRepositorio.obtenerTodos(filtros);
  },

  async obtenerPorId(id: string): Promise<RespuestaHistorialDto> {
    const registro = await historialRepositorio.obtenerPorId(id);
    if (!registro) throw ApiError.noEncontrado('Registro de historial no encontrado');
    return registro;
  },

  crear(data: CrearHistorialDto): Promise<RespuestaHistorialDto> {
    return historialRepositorio.crear(data);
  },
};
