// @ts-nocheck
import { prisma } from '../prisma';
import { CrearHistorialDto } from './historial.dto';

export const historialRepositorio = {
  obtenerTodos(filtros: {
    hechoPorId?: string;
    modulo?: string;
    nombreAccion?: string;
    accion?: string;
    buscar?: string;
    desde?: Date;
    hasta?: Date;
  } = {}) {
    const where: any = {};

    if (filtros.hechoPorId) where.hechoPorId = filtros.hechoPorId;
    if (filtros.modulo) where.modulo = filtros.modulo;
    if (filtros.nombreAccion) where.nombreAccion = filtros.nombreAccion;
    if (filtros.accion) where.accion = filtros.accion;
    if (filtros.buscar) {
      where.OR = [
        { nombreAccion: { contains: filtros.buscar, mode: 'insensitive' } },
        { accion: { contains: filtros.buscar, mode: 'insensitive' } },
        { modulo: { contains: filtros.buscar, mode: 'insensitive' } },
        { hechoPor: { OR: [
          { nombre: { contains: filtros.buscar, mode: 'insensitive' } },
          { apellidos: { contains: filtros.buscar, mode: 'insensitive' } },
          { correo: { contains: filtros.buscar, mode: 'insensitive' } },
        ]}},
      ];
    }
    if (filtros.desde || filtros.hasta) {
      where.creadoEn = {};
      if (filtros.desde) where.creadoEn.gte = filtros.desde;
      if (filtros.hasta) where.creadoEn.lte = filtros.hasta;
    }

    return prisma.historial.findMany({
      where,
      include: { hechoPor: { select: { id: true, nombre: true, apellidos: true, correo: true } } },
      orderBy: { creadoEn: 'desc' },
      take: 100,
    });
  },

  obtenerPorId(id: string) {
    return prisma.historial.findUnique({
      where: { id },
      include: { hechoPor: { select: { id: true, nombre: true, apellidos: true, correo: true } } },
    });
  },

  crear(data: CrearHistorialDto) {
    return prisma.historial.create({ data });
  },
};
