// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { historialServicio } from './historial.service';
import { RespuestaHistorialDto } from './historial.dto';

export const historialControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const { hechoPorId, modulo, nombreAccion, accion, buscar, desde, hasta } = req.query;

      const filtros: any = {};
      if (hechoPorId) filtros.hechoPorId = hechoPorId as string;
      if (modulo) filtros.modulo = modulo as string;
      if (nombreAccion) filtros.nombreAccion = nombreAccion as string;
      if (accion) filtros.accion = accion as string;
      if (buscar) filtros.buscar = buscar as string;
      if (desde) filtros.desde = new Date(desde as string);
      if (hasta) filtros.hasta = new Date(hasta as string);

      const registros: RespuestaHistorialDto[] = await historialServicio.obtenerTodos(filtros);
      res.json({ success: true, data: registros });
    } catch (error) {
      next(error);
    }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const registro: RespuestaHistorialDto = await historialServicio.obtenerPorId(id);
      res.json({ success: true, data: registro });
    } catch (error) {
      next(error);
    }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const registro: RespuestaHistorialDto = await historialServicio.crear(req.body);
      res.status(201).json({ success: true, data: registro });
    } catch (error) {
      next(error);
    }
  },
};
