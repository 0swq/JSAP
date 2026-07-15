import { Request, Response, NextFunction } from "express";
import { verificarToken } from "@config/jwt";
import { ApiError } from "@utils/ApiError";
import {prisma} from "@modules/prisma";

export const middlewareAutenticacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const encabezadoAuth = req.headers.authorization;
        if (!encabezadoAuth || !encabezadoAuth.startsWith('Bearer ')) {
            throw ApiError.noAutorizado('Token de acceso no proporcionado');
        }
        const token = encabezadoAuth.split(' ')[1];

        if (!token) {
            throw ApiError.noAutorizado('Token de acceso no proporcionado');
        }

        const decodificado = verificarToken(token) as { id: string };

        const usuario = await prisma.usuario.findUnique({
            where: { id: decodificado.id },
            include: { rol: true },
        });

        if (!usuario) {
            throw ApiError.noAutorizado('Usuario no encontrado');
        }

        const { passwordHash, ...usuarioSinPassword } = usuario;
        (req as any).usuario = usuarioSinPassword;

        next();
    } catch (error: any) {
        if (error.esOperacional) {
            return next(error);
        }

        if (error.name === 'JsonWebTokenError') {
            return next(ApiError.noAutorizado('Token inválido'));
        }

        if (error.name === 'TokenExpiredError') {
            return next(ApiError.noAutorizado('Token expirado'));
        }

        return next(ApiError.noAutorizado('Error de autenticación'));
    }
};