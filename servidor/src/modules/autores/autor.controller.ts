// @ts-nocheck
import {Request, Response, NextFunction} from 'express';
import {autorServicio} from './autor.service';
import {RespuestaAutorDto} from './autor.dto';

export const autorControlador = {
    async obtenerTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const autores: RespuestaAutorDto[] = await autorServicio.obtenerTodos();
            res.json({success: true, data: autores});
        } catch (error) {
            next(error);
        }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const autor: RespuestaAutorDto = await autorServicio.obtenerPorId(id);
            res.json({success: true, data: autor});
        } catch (error) {
            next(error);
        }
    },

    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const autor: RespuestaAutorDto = await autorServicio.crear(req.body);
            res.status(201).json({success: true, data: autor});
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const autor: RespuestaAutorDto = await autorServicio.actualizar(id, req.body);
            res.json({success: true, data: autor});
        } catch (error) {
            next(error);
        }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await autorServicio.eliminar(id);
            res.json({success: true, mensaje: 'Autor eliminado correctamente'});
        } catch (error) {
            next(error);
        }
    },
};
