// @ts-nocheck
import { prisma } from '../prisma';
import { CrearEditorialDto, ActualizarEditorialDto } from './editorial.dto';

export const editorialRepositorio = {
  obtenerTodos() {
    return prisma.editorial.findMany({
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.editorial.findUnique({
      where: { id },
      include: { libros: true },
    });
  },

  crear(data: CrearEditorialDto) {
    return prisma.editorial.create({ data });
  },

  actualizar(id: string, data: ActualizarEditorialDto) {
    return prisma.editorial.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.editorial.delete({ where: { id } });
  },
};
