// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearResenaDto, ActualizarResenaDto, RespuestaResenaDto } from './resena.dto';
import { resenaRepositorio } from './resena.repository';

export const resenaServicio = {
  obtenerPorLibro(libroId: string): Promise<RespuestaResenaDto[]> {
    return resenaRepositorio.obtenerPorLibro(libroId);
  },

  async obtenerPorId(id: string): Promise<RespuestaResenaDto> {
    const resena = await resenaRepositorio.obtenerPorId(id);
    if (!resena) throw ApiError.noEncontrado('Reseña no encontrada');
    return resena;
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaResenaDto[]> {
    return resenaRepositorio.obtenerPorUsuario(usuarioId);
  },

  crear(data: CrearResenaDto): Promise<RespuestaResenaDto> {
    return resenaRepositorio.crear(data);
  },

  async actualizar(id: string, usuarioId: string, data: ActualizarResenaDto): Promise<RespuestaResenaDto> {
    const resena = await resenaRepositorio.obtenerPorId(id);
    if (!resena) throw ApiError.noEncontrado('Reseña no encontrada');
    if (resena.usuarioId !== usuarioId) {
      throw ApiError.accesoDenegado('Solo puedes editar tus propias reseñas');
    }
    return resenaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    if (!await resenaRepositorio.obtenerPorId(id)) throw ApiError.noEncontrado('Reseña no encontrada');
    await resenaRepositorio.eliminar(id);
  },
};
