// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { categoriaServicio } from './categoria.service';
import { RespuestaCategoriaDto } from './categoria.dto';

export const categoriaControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const categorias: RespuestaCategoriaDto[] = await categoriaServicio.obtenerTodos();
      res.json({ success: true, data: categorias });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria: RespuestaCategoriaDto = await categoriaServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: categoria });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria: RespuestaCategoriaDto = await categoriaServicio.crear(req.body);
      res.status(201).json({ success: true, data: categoria });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria: RespuestaCategoriaDto = await categoriaServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: categoria });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await categoriaServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Categoría eliminada correctamente' });
    } catch (error) { next(error); }
  },
};
