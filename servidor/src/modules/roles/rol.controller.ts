// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { rolServicio } from './rol.service';
import { RespuestaRolDto } from './rol.dto';

export const rolControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const roles: RespuestaRolDto[] = await rolServicio.obtenerTodos();
      res.json({ success: true, data: roles });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const rol: RespuestaRolDto = await rolServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: rol });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const rol: RespuestaRolDto = await rolServicio.crear(req.body);
      res.status(201).json({ success: true, data: rol });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const rol: RespuestaRolDto = await rolServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: rol });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await rolServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Rol eliminado correctamente' });
    } catch (error) { next(error); }
  },
};
