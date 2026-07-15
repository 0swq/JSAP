// @ts-nocheck
import { prisma } from '../prisma';
import { CrearPagoMultaDto, ActualizarPagoMultaDto } from './pago-multa.dto';

export const pagoMultaRepositorio = {
  obtenerTodos() {
    return prisma.pagoMulta.findMany({
      include: {
        multa: {
          include: {
            usuario: { select: { id: true, nombre: true, apellidos: true, correo: true } },
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorMulta(multaId: string) {
    return prisma.pagoMulta.findMany({
      where: { multaId },
      include: { multa: true },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.pagoMulta.findUnique({
      where: { id },
      include: { multa: true },
    });
  },

  crear(data: CrearPagoMultaDto) {
    return prisma.pagoMulta.create({ data });
  },

  actualizar(id: string, data: ActualizarPagoMultaDto) {
    return prisma.pagoMulta.update({ where: { id }, data });
  },

  eliminar(id: string) {
    return prisma.pagoMulta.delete({ where: { id } });
  },
};
