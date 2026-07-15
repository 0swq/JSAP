import { Request, Response, NextFunction } from 'express';
import {ApiError} from "@utils/ApiError";

export const middlewareRol = (rolesPermitidos: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuario = (req as any).usuario;

        if (!usuario) {
            return next(ApiError.noAutorizado('Se requiere autenticación'));
        }

        if (!usuario.rol?.nombre) {
            return next(ApiError.accesoDenegado('Rol de usuario no definido'));
        }

        const rolUsuario = usuario.rol.nombre;

        if (!rolesPermitidos.includes(rolUsuario)) {
            return next(
                ApiError.accesoDenegado(
                    `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}`
                )
            );
        }

        next();
    };
};