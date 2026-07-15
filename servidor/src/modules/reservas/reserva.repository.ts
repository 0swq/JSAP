// @ts-nocheck
import { prisma } from '../prisma';
import { CrearReservaDto, ActualizarReservaDto } from './reserva.dto';

export const reservaRepositorio = {
  obtenerTodos(filtros: { estado?: string; usuarioId?: string; libroId?: string } = {}) {
    const where: any = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.libroId) where.libroId = filtros.libroId;
    return prisma.reserva.findMany({
      where,
      include: { usuario: { select: { id: true, nombre: true, apellidos: true, correo: true } }, libro: { select: { id: true, titulo: true } }, ejemplar: { select: { id: true, codigoBarras: true, estado: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  contarActivasPorUsuario(usuarioId: string) {
    return prisma.reserva.count({
      where: { usuarioId, estado: { in: ['pendiente', 'activa'] } },
    });
  },

  obtenerPorUsuario(usuarioId: string) {
    return prisma.reserva.findMany({
      where: { usuarioId },
      include: { libro: { select: { id: true, titulo: true } }, ejemplar: { select: { id: true, codigoBarras: true, estado: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.reserva.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nombre: true, apellidos: true, correo: true } }, libro: { select: { id: true, titulo: true } }, ejemplar: { select: { id: true, codigoBarras: true, estado: true } } },
    });
  },

  crear(data: CrearReservaDto) {
    return prisma.reserva.create({ data });
  },

  actualizar(id: string, data: ActualizarReservaDto) {
    return prisma.reserva.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.reserva.delete({ where: { id } });
  },
};
