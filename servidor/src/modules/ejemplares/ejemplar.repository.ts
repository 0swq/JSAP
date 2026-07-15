// @ts-nocheck
import { prisma } from '../prisma';
import { CrearEjemplarDto, ActualizarEjemplarDto } from './ejemplar.dto';

export const ejemplarRepositorio = {
  obtenerTodos() {
    return prisma.ejemplar.findMany({
      include: { libro: { select: { id: true, titulo: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorLibro(libroId: string) {
    return prisma.ejemplar.findMany({
      where: { libroId },
      include: { libro: { select: { id: true, titulo: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.ejemplar.findUnique({
      where: { id },
      include: { libro: { select: { id: true, titulo: true } } },
    });
  },

  crear(data: CrearEjemplarDto) {
    return prisma.ejemplar.create({ data });
  },

  actualizar(id: string, data: ActualizarEjemplarDto) {
    return prisma.ejemplar.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.ejemplar.delete({ where: { id } });
  },
};
