// @ts-nocheck
import { prisma } from '../prisma';
import { CrearMultaDto, ActualizarMultaDto } from './multa.dto';

export const multaRepositorio = {
  obtenerTodos(filtros: { estado?: string; usuarioId?: string } = {}) {
    const where: any = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.usuarioId) {
      where.prestamo = { usuarioId: filtros.usuarioId };
    }

    return prisma.multa.findMany({
      where,
      include: {
        prestamo: {
          include: {
            ejemplar: { include: { libro: { select: { id: true, titulo: true } } } },
            usuario: { select: { id: true, nombre: true, apellidos: true, correo: true } },
          },
        },
        pagos: true,
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorUsuario(usuarioId: string) {
    return prisma.multa.findMany({
      where: {
        prestamo: { usuarioId },
      },
      include: {
        prestamo: {
          include: {
            ejemplar: { include: { libro: { select: { id: true, titulo: true } } } },
            usuario: { select: { id: true, nombre: true, apellidos: true, correo: true } },
          },
        },
        pagos: true,
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.multa.findUnique({
      where: { id },
      include: {
        prestamo: {
          include: {
            ejemplar: {
              include: {
                libro: {
                  include: {
                    editorial: { select: { id: true, nombre: true } },
                    autores: { include: { autor: { select: { id: true, nombre: true, apellidos: true } } } },
                    categorias: { include: { categoria: { select: { id: true, nombre: true } } } },
                  },
                },
              },
            },
            usuario: { select: { id: true, nombre: true, apellidos: true, correo: true, dni: true } },
          },
        },
        pagos: true,
      },
    });
  },

  crear(data: CrearMultaDto) {
    return prisma.multa.create({ data });
  },

  actualizar(id: string, data: ActualizarMultaDto) {
    return prisma.multa.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.multa.delete({ where: { id } });
  },
};
