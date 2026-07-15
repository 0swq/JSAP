// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { configuracionMultaServicio } from './configuracion-multa.service';
import { RespuestaConfiguracionMultaDto } from './configuracion-multa.dto';

export const configuracionMultaControlador = {
  async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const config: RespuestaConfiguracionMultaDto | null = await configuracionMultaServicio.obtener();
      res.json({ success: true, data: config });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const config: RespuestaConfiguracionMultaDto = await configuracionMultaServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: config });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const config: RespuestaConfiguracionMultaDto = await configuracionMultaServicio.crear(req.body);
      res.status(201).json({ success: true, data: config });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const config: RespuestaConfiguracionMultaDto = await configuracionMultaServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: config });
    } catch (error) { next(error); }
  },
};
