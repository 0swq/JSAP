// @ts-nocheck
import { prisma } from '../prisma';
import { CrearAutorDto, ActualizarAutorDto } from './autor.dto';

export const autorRepositorio = {
  obtenerTodos() {
    return prisma.autor.findMany({
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.autor.findUnique({
      where: { id },
      include: { libros: { include: { libro: true } } },
    });
  },

  crear(data: CrearAutorDto) {
    return prisma.autor.create({ data });
  },

  actualizar(id: string, data: ActualizarAutorDto) {
    return prisma.autor.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.autor.delete({ where: { id } });
  },
};
