// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { prisma } from '../prisma';
import { CrearReservaDto, ActualizarReservaDto, RespuestaReservaDto } from './reserva.dto';
import { reservaRepositorio } from './reserva.repository';

const LIMITE = 3;

export const reservaServicio = {
  obtenerTodos(filtros: any = {}): Promise<RespuestaReservaDto[]> {
    return reservaRepositorio.obtenerTodos(filtros);
  },

  async obtenerPorId(id: string): Promise<RespuestaReservaDto> {
    const reserva = await reservaRepositorio.obtenerPorId(id);
    if (!reserva) throw ApiError.noEncontrado('Reserva no encontrada');
    return reserva;
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaReservaDto[]> {
    return reservaRepositorio.obtenerPorUsuario(usuarioId);
  },

  async crear(data: CrearReservaDto & { usuarioId: string }): Promise<RespuestaReservaDto> {
    const activas = await reservaRepositorio.contarActivasPorUsuario(data.usuarioId);
    if (activas >= LIMITE) {
      throw ApiError.conflicto(`Has alcanzado el límite de ${LIMITE} reservas activas`);
    }

    // Transacción: crear reserva y cambiar estado del ejemplar a "reservado"
    const [reserva, ejemplarUpdate] = await prisma.$transaction([
      prisma.reserva.create({ data }),
      prisma.ejemplar.updateMany({
        where: { id: data.ejemplarId, estado: 'disponible' },
        data: { estado: 'reservado' },
      }),
    ]);

    if (ejemplarUpdate.count === 0) {
      throw ApiError.conflicto('El ejemplar ya no está disponible para reservar');
    }

    return reserva;
  },

  async actualizar(id: string, data: ActualizarReservaDto): Promise<RespuestaReservaDto> {
    const reserva = await reservaRepositorio.obtenerPorId(id);
    if (!reserva) throw ApiError.noEncontrado('Reserva no encontrada');

    // Si la reserva se completa, cancela o expira, liberar el ejemplar
    if (data.estado && ['completada', 'cancelada', 'expirada'].includes(data.estado)) {
      const [actualizada] = await prisma.$transaction([
        prisma.reserva.update({ where: { id }, data }),
        prisma.ejemplar.update({
          where: { id: reserva.ejemplarId },
          data: { estado: 'disponible' },
        }),
      ]);
      return actualizada;
    }

    return reservaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    const reserva = await reservaRepositorio.obtenerPorId(id);
    if (!reserva) throw ApiError.noEncontrado('Reserva no encontrada');

    // Al eliminar, liberar el ejemplar
    await prisma.$transaction([
      prisma.reserva.delete({ where: { id } }),
      prisma.ejemplar.update({
        where: { id: reserva.ejemplarId },
        data: { estado: 'disponible' },
      }),
    ]);
  },
};
