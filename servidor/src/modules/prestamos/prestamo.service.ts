import {ApiError} from '@utils/ApiError';
import {prisma} from '../prisma';
import {CrearPrestamoDto, ActualizarPrestamoDto, RespuestaPrestamoDto} from './prestamo.dto';
import {prestamoRepositorio} from './prestamo.repository';

export const prestamoServicio = {
    obtenerTodos(filtros: any = {}): Promise<RespuestaPrestamoDto[]> {
        return prestamoRepositorio.obtenerTodos(filtros);
    },

    obtenerPorUsuario(usuarioId: string): Promise<RespuestaPrestamoDto[]> {
        return prestamoRepositorio.obtenerPorUsuario(usuarioId);
    },

    async obtenerPorId(id: string, usuarioId: string, rol: string): Promise<RespuestaPrestamoDto> {
        const prestamo = await prestamoRepositorio.obtenerPorId(id);
        if (!prestamo) throw ApiError.noEncontrado("Préstamo no encontrado");

        if (rol === 'docente' || rol === 'estudiante') {
            if (prestamo.usuarioId !== usuarioId) {
                throw ApiError.noAutorizado('No puedes ver préstamos de otros usuarios');
            }
        }

        return prestamo;
    },

    async crear(data: CrearPrestamoDto): Promise<RespuestaPrestamoDto> {
        // Transacción: crear préstamo y cambiar estado del ejemplar a "prestado"
        const [prestamo, ejemplarUpdate] = await prisma.$transaction([
            prisma.prestamo.create({ data }),
            prisma.ejemplar.updateMany({
                where: { id: data.ejemplarId, estado: 'disponible' },
                data: { estado: 'prestado' },
            }),
        ]);

        if (ejemplarUpdate.count === 0) {
            throw ApiError.conflicto('El ejemplar ya no está disponible para préstamo');
        }

        return prestamo;
    },

    async actualizar(id: string, data: ActualizarPrestamoDto): Promise<RespuestaPrestamoDto> {
        const prestamo = await prestamoRepositorio.obtenerPorId(id);
        if (!prestamo) throw ApiError.noEncontrado('Préstamo no encontrado');

        // Si el préstamo se devuelve (fechaDevolucion o estado "devuelto"), liberar el ejemplar
        const esDevolucion = data.fechaDevolucion || data.estado === 'devuelto';

        if (esDevolucion) {
            const updateData: any = { ...data };
            if (data.fechaDevolucion && !data.estado) {
                updateData.estado = 'devuelto';
            }

            const [actualizado] = await prisma.$transaction([
                prisma.prestamo.update({ where: { id }, data: updateData }),
                prisma.ejemplar.update({
                    where: { id: prestamo.ejemplarId },
                    data: { estado: 'disponible' },
                }),
            ]);
            return actualizado;
        }

        return prestamoRepositorio.actualizar(id, data);
    },

    async eliminar(id: string): Promise<void> {
        const prestamo = await prestamoRepositorio.obtenerPorId(id);
        if (!prestamo) throw ApiError.noEncontrado('Préstamo no encontrado');

        // Al eliminar, liberar el ejemplar
        await prisma.$transaction([
            prisma.prestamo.delete({ where: { id } }),
            prisma.ejemplar.update({
                where: { id: prestamo.ejemplarId },
                data: { estado: 'disponible' },
            }),
        ]);
    },
};
