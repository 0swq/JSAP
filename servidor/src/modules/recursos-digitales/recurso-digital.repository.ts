// @ts-nocheck
import { prisma } from '../prisma';
import { CrearRecursoDigitalDto, ActualizarRecursoDigitalDto } from './recurso-digital.dto';

export const recursoDigitalRepositorio = {
  obtenerTodos() {
    return prisma.recursoDigital.findMany({
      include: { libro: { select: { id: true, titulo: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorLibro(libroId: string) {
    return prisma.recursoDigital.findMany({
      where: { libroId },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.recursoDigital.findUnique({
      where: { id },
      include: { libro: { select: { id: true, titulo: true } } },
    });
  },

  crear(data: CrearRecursoDigitalDto) {
    return prisma.recursoDigital.create({ data });
  },

  actualizar(id: string, data: ActualizarRecursoDigitalDto) {
    return prisma.recursoDigital.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.recursoDigital.delete({ where: { id } });
  },
};
