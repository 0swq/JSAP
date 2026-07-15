// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearFavoritoDto, RespuestaFavoritoDto } from './favorito.dto';
import { favoritoRepositorio } from './favorito.repository';

export const favoritoServicio = {
  obtenerPorUsuario(usuarioId: string): Promise<RespuestaFavoritoDto[]> {
    return favoritoRepositorio.obtenerPorUsuario(usuarioId);
  },

  async obtenerPorId(id: string): Promise<RespuestaFavoritoDto> {
    const favorito = await favoritoRepositorio.obtenerPorId(id);
    if (!favorito) throw ApiError.noEncontrado('Favorito no encontrado');
    return favorito;
  },

  crear(data: CrearFavoritoDto): Promise<RespuestaFavoritoDto> {
    return favoritoRepositorio.crear(data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await favoritoRepositorio.eliminar(id);
  },
};
