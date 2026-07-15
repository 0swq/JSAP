// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { ejemplarServicio } from './ejemplar.service';
import { RespuestaEjemplarDto } from './ejemplar.dto';

export const ejemplarControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const ejemplares: RespuestaEjemplarDto[] = await ejemplarServicio.obtenerTodos();
      res.json({ success: true, data: ejemplares });
    } catch (error) { next(error); }
  },

  async obtenerPorLibro(req: Request, res: Response, next: NextFunction) {
    try {
      const ejemplares: RespuestaEjemplarDto[] = await ejemplarServicio.obtenerPorLibro(req.params.libroId as string);
      res.json({ success: true, data: ejemplares });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const ejemplar: RespuestaEjemplarDto = await ejemplarServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: ejemplar });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const ejemplar: RespuestaEjemplarDto = await ejemplarServicio.crear(req.body);
      res.status(201).json({ success: true, data: ejemplar });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const ejemplar: RespuestaEjemplarDto = await ejemplarServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: ejemplar });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await ejemplarServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Ejemplar eliminado correctamente' });
    } catch (error) { next(error); }
  },
};
