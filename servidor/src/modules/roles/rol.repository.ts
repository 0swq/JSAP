// @ts-nocheck
import { prisma } from '../prisma';
import { CrearRolDto, ActualizarRolDto } from './rol.dto';

export const rolRepositorio = {
  obtenerTodos() {
    return prisma.rol.findMany({
      include: { usuarios: true },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.rol.findUnique({
      where: { id },
      include: { usuarios: true },
    });
  },

  crear(data: CrearRolDto) {
    return prisma.rol.create({ data });
  },

  actualizar(id: string, data: ActualizarRolDto) {
    return prisma.rol.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.rol.delete({ where: { id } });
  },
};
