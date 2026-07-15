// @ts-nocheck
import { prisma } from '../prisma';
import { CrearResenaDto, ActualizarResenaDto } from './resena.dto';

export const resenaRepositorio = {
  obtenerPorLibro(libroId: string) {
    return prisma.resena.findMany({
      where: { libroId },
      include: { usuario: { select: { id: true, nombre: true, apellidos: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorUsuario(usuarioId: string) {
    return prisma.resena.findMany({
      where: { usuarioId },
      include: { libro: { select: { id: true, titulo: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.resena.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true } },
        libro: { select: { id: true, titulo: true } },
      },
    });
  },

  crear(data: CrearResenaDto) {
    return prisma.resena.create({ data });
  },

  actualizar(id: string, data: ActualizarResenaDto) {
    return prisma.resena.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.resena.delete({ where: { id } });
  },
};
