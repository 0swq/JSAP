// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import {usuarioServicio} from "@modules/usuarios/usuario.service";
import {RespuestaUsuarioDto} from "@modules/usuarios/usuario.dto";

export const usuarioControlador = {
    async obtenerTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios:RespuestaUsuarioDto[] = await usuarioServicio.obtenerTodos();
            res.json({ success: true, data: usuarios });
        } catch (error) {
            next(error);
        }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const usuario:RespuestaUsuarioDto = await usuarioServicio.obtenerPorId(id);
            res.json({ success: true, data: usuario });
        } catch (error) {
            next(error);
        }
    },

    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario:RespuestaUsuarioDto = await usuarioServicio.crear(req.body);
            res.status(201).json({ success: true, data: usuario });
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const usuario:RespuestaUsuarioDto = await usuarioServicio.actualizar(id, req.body);
            res.json({ success: true, data: usuario });
        } catch (error) {
            next(error);
        }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await usuarioServicio.eliminar(id);
            res.json({ success: true, mensaje: 'Usuario eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { correo, password } = req.body;
            const resultado = await usuarioServicio.login(correo, password);
            res.json({ success: true, data: resultado });
        } catch (error) {
            next(error);
        }
    },

    async perfilPropio(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario: RespuestaUsuarioDto = await usuarioServicio.obtenerPorId((req as any).usuario.id);
            res.json({ success: true, data: usuario });
        } catch (error) { next(error); }
    },

    /** Devuelve { id, nombre, apellidos, correo } del usuario — público para autenticados */
    async obtenerNombrePorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const usuario = await usuarioServicio.obtenerPorId(id);
            res.json({ success: true, data: { id: usuario.id, nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo } });
        } catch (error) { next(error); }
    },
};
