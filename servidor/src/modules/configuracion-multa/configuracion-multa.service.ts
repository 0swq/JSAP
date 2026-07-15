// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearConfiguracionMultaDto, ActualizarConfiguracionMultaDto, RespuestaConfiguracionMultaDto } from './configuracion-multa.dto';
import { configuracionMultaRepositorio } from './configuracion-multa.repository';

export const configuracionMultaServicio = {
  obtener(): Promise<RespuestaConfiguracionMultaDto | null> {
    return configuracionMultaRepositorio.obtener();
  },

  async obtenerPorId(id: string): Promise<RespuestaConfiguracionMultaDto> {
    const config = await configuracionMultaRepositorio.obtenerPorId(id);
    if (!config) throw ApiError.noEncontrado('Configuración no encontrada');
    return config;
  },

  crear(data: CrearConfiguracionMultaDto): Promise<RespuestaConfiguracionMultaDto> {
    return configuracionMultaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarConfiguracionMultaDto): Promise<RespuestaConfiguracionMultaDto> {
    await this.obtenerPorId(id);
    return configuracionMultaRepositorio.actualizar(id, data);
  },
};
