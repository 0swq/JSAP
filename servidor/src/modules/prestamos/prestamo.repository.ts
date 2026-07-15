// @ts-nocheck
import { prisma } from '../prisma';
import { CrearPrestamoDto, ActualizarPrestamoDto } from './prestamo.dto';

export const prestamoRepositorio = {
  obtenerTodos(filtros: { estado?: string; usuarioId?: string; ejemplarId?: string } = {}) {
    const where: any = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.ejemplarId) where.ejemplarId = filtros.ejemplarId;

    return prisma.prestamo.findMany({
      where,
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, correo: true, dni: true } },
        ejemplar: { include: { libro: { select: { id: true, titulo: true, fotoUrl: true } } } },
        multa: true,
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorUsuario(usuarioId: string) {
    return prisma.prestamo.findMany({
      where: { usuarioId },
      include: {
        ejemplar: { include: { libro: { select: { id: true, titulo: true } } } },
        multa: true,
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.prestamo.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, correo: true, dni: true } },
        ejemplar: {
          include: {
            libro: {
              select: {
                id: true,
                titulo: true,
                fotoUrl: true,
                autores: { include: { autor: { select: { nombre: true, apellidos: true } } } },
              },
            },
          },
        },
        multa: true,
      },
    });
  },

  crear(data: CrearPrestamoDto) {
    return prisma.prestamo.create({ data });
  },

  actualizar(id: string, data: ActualizarPrestamoDto) {
    return prisma.prestamo.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.prestamo.delete({ where: { id } });
  },
};
