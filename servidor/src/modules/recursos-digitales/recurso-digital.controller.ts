// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { recursoDigitalServicio } from './recurso-digital.service';
import { RespuestaRecursoDigitalDto } from './recurso-digital.dto';

export const recursoDigitalControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const recursos: RespuestaRecursoDigitalDto[] = await recursoDigitalServicio.obtenerTodos();
      res.json({ success: true, data: recursos });
    } catch (error) { next(error); }
  },

  async obtenerPorLibro(req: Request, res: Response, next: NextFunction) {
    try {
      const recursos: RespuestaRecursoDigitalDto[] = await recursoDigitalServicio.obtenerPorLibro(req.params.libroId as string);
      res.json({ success: true, data: recursos });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const recurso: RespuestaRecursoDigitalDto = await recursoDigitalServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: recurso });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const recurso: RespuestaRecursoDigitalDto = await recursoDigitalServicio.crear(req.body);
      res.status(201).json({ success: true, data: recurso });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const recurso: RespuestaRecursoDigitalDto = await recursoDigitalServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: recurso });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await recursoDigitalServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Recurso digital eliminado correctamente' });
    } catch (error) { next(error); }
  },
};
