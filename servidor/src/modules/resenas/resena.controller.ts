// @ts-nocheck
import {Request, Response, NextFunction} from 'express';
import {resenaServicio} from './resena.service';
import {RespuestaResenaDto} from './resena.dto';

export const resenaControlador = {
    async obtenerPorLibro(req: Request, res: Response, next: NextFunction) {
        try {
            const resenas: RespuestaResenaDto[] = await resenaServicio.obtenerPorLibro(req.params.libroId);
            res.json({success: true, data: resenas});
        } catch (error) { next(error); }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = (req as any).usuario;
            const resena: RespuestaResenaDto = await resenaServicio.obtenerPorId(
                req.params.id,
                usuario.id,
                usuario.rol.nombre
            );
            res.json({success: true, data: resena});
        } catch (error) { next(error); }
    },

    async misResenas(req: Request, res: Response, next: NextFunction) {
        try {
            const resenas: RespuestaResenaDto[] = await resenaServicio.obtenerPorUsuario((req as any).usuario.id);
            res.json({success: true, data: resenas});
        } catch (error) { next(error); }
    },

    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = (req as any).usuario;
            const resena: RespuestaResenaDto = await resenaServicio.crear({
                ...req.body,
                usuarioId: usuario.id,
            });
            res.status(201).json({success: true, data: resena});
        } catch (error) { next(error); }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = (req as any).usuario;
            const resena: RespuestaResenaDto = await resenaServicio.actualizar(
                req.params.id,
                usuario.id,
                req.body
            );
            res.json({success: true, data: resena});
        } catch (error) { next(error); }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = (req as any).usuario;
            await resenaServicio.eliminar(req.params.id, usuario.id, usuario.rol.nombre);
            res.json({success: true, mensaje: 'Reseña eliminada correctamente'});
        } catch (error) { next(error); }
    },
};
