// @ts-nocheck
import {Request, Response, NextFunction} from 'express';
import {reservaServicio} from './reserva.service';
import {RespuestaReservaDto} from './reserva.dto';

export const reservaControlador = {
    async obtenerTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const reservas = await reservaServicio.obtenerTodos(req.query);
            res.json({success: true, data: reservas});
        } catch (error) { next(error); }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const reserva = await reservaServicio.obtenerPorId(req.params.id);
            res.json({success: true, data: reserva});
        } catch (error) { next(error); }
    },

    async misReservas(req: Request, res: Response, next: NextFunction) {
        try {
            const reservas = await reservaServicio.obtenerPorUsuario((req as any).usuario.id);
            res.json({success: true, data: reservas});
        } catch (error) { next(error); }
    },

    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const reserva = await reservaServicio.crear({
                ...req.body,
                usuarioId: (req as any).usuario.id,
            });
            res.status(201).json({success: true, data: reserva});
        } catch (error) { next(error); }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const reserva = await reservaServicio.actualizar(req.params.id, req.body);
            res.json({success: true, data: reserva});
        } catch (error) { next(error); }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            await reservaServicio.eliminar(req.params.id);
            res.json({success: true, mensaje: 'Reserva eliminada correctamente'});
        } catch (error) { next(error); }
    },
};
