// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { editorialServicio } from './editorial.service';
import { RespuestaEditorialDto } from './editorial.dto';

export const editorialControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const editoriales: RespuestaEditorialDto[] = await editorialServicio.obtenerTodos();
      res.json({ success: true, data: editoriales });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const editorial: RespuestaEditorialDto = await editorialServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: editorial });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const editorial: RespuestaEditorialDto = await editorialServicio.crear(req.body);
      res.status(201).json({ success: true, data: editorial });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const editorial: RespuestaEditorialDto = await editorialServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: editorial });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await editorialServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Editorial eliminada correctamente' });
    } catch (error) { next(error); }
  },
};
