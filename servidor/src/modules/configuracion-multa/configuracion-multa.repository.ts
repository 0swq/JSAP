// @ts-nocheck
import { prisma } from '../prisma';
import { CrearConfiguracionMultaDto, ActualizarConfiguracionMultaDto } from './configuracion-multa.dto';

export const configuracionMultaRepositorio = {
  obtener() {
    return prisma.configuracionMulta.findFirst({
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerPorId(id: string) {
    return prisma.configuracionMulta.findUnique({ where: { id } });
  },

  crear(data: CrearConfiguracionMultaDto) {
    return prisma.configuracionMulta.create({ data });
  },

  actualizar(id: string, data: ActualizarConfiguracionMultaDto) {
    return prisma.configuracionMulta.update({ where: { id }, data });
  },
};
