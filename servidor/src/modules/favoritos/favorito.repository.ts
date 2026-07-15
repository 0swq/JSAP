// @ts-nocheck
import { prisma } from '../prisma';
import { CrearFavoritoDto } from './favorito.dto';

export const favoritoRepositorio = {
  obtenerPorUsuario(usuarioId: string) {
    return prisma.favorito.findMany({
      where: { usuarioId },
      include: { libro: { select: { id: true, titulo: true, isbn: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.favorito.findUnique({
      where: { id },
      include: { libro: { select: { id: true, titulo: true, isbn: true } } },
    });
  },

  crear(data: CrearFavoritoDto) {
    return prisma.favorito.create({ data });
  },

  eliminar(id: string) {
    return prisma.favorito.delete({ where: { id } });
  },
};
