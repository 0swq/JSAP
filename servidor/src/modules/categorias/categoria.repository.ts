// @ts-nocheck
import { prisma } from '../prisma';
import { CrearCategoriaDto, ActualizarCategoriaDto } from './categoria.dto';

export const categoriaRepositorio = {
  obtenerTodos() {
    return prisma.categoria.findMany({
      include: { subcategorias: true },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.categoria.findUnique({
      where: { id },
      include: { subcategorias: true, libros: { include: { libro: true } } },
    });
  },

  crear(data: CrearCategoriaDto) {
    return prisma.categoria.create({ data });
  },

  actualizar(id: string, data: ActualizarCategoriaDto) {
    return prisma.categoria.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.categoria.delete({ where: { id } });
  },
};
