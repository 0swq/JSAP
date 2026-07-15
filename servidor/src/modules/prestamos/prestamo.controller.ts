// @ts-nocheck
import {Request, Response, NextFunction} from 'express';
import {prestamoServicio} from './prestamo.service';
import {RespuestaPrestamoDto} from './prestamo.dto';

export const prestamoControlador = {
    async obtenerTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const prestamos: RespuestaPrestamoDto[] = await prestamoServicio.obtenerTodos(req.query);
            res.json({success: true, data: prestamos});
        } catch (error) {
            next(error);
        }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = (req as any).usuario;
            const prestamo: RespuestaPrestamoDto = await prestamoServicio.obtenerPorId(
                req.params.id,
                usuario.id,
                usuario.rol.nombre
            );
            res.json({success: true, data: prestamo});
        } catch (error) {
            next(error);
        }
    },

    async misPrestamos(req: Request, res: Response, next: NextFunction) {
        try {
            const prestamos: RespuestaPrestamoDto[] = await prestamoServicio.obtenerPorUsuario((req as any).usuario.id);
            res.json({success: true, data: prestamos});
        } catch (error) {
            next(error);
        }
    },

    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const prestamo: RespuestaPrestamoDto = await prestamoServicio.crear(req.body);
            res.status(201).json({success: true, data: prestamo});
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const prestamo: RespuestaPrestamoDto = await prestamoServicio.actualizar(req.params.id as string, req.body);
            res.json({success: true, data: prestamo});
        } catch (error) {
            next(error);
        }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            await prestamoServicio.eliminar(req.params.id as string);
            res.json({success: true, mensaje: 'Préstamo eliminado correctamente'});
        } catch (error) {
            next(error);
        }
    },
};
