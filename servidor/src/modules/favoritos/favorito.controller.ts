// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { favoritoServicio } from './favorito.service';
import { RespuestaFavoritoDto } from './favorito.dto';

export const favoritoControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const favoritos: RespuestaFavoritoDto[] = await favoritoServicio.obtenerTodos(req.query);
      res.json({ success: true, data: favoritos });
    } catch (error) { next(error); }
  },

  async obtenerPorUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const favoritos: RespuestaFavoritoDto[] = await favoritoServicio.obtenerPorUsuario(req.params.usuarioId as string);
      res.json({ success: true, data: favoritos });
    } catch (error) { next(error); }
  },

  async misFavoritos(req: Request, res: Response, next: NextFunction) {
    try {
      const favoritos: RespuestaFavoritoDto[] = await favoritoServicio.obtenerPorUsuario((req as any).usuario.id);
      res.json({ success: true, data: favoritos });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const favorito: RespuestaFavoritoDto = await favoritoServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: favorito });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const favorito: RespuestaFavoritoDto = await favoritoServicio.crear(req.body);
      res.status(201).json({ success: true, data: favorito });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const favorito: RespuestaFavoritoDto = await favoritoServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: favorito });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await favoritoServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Favorito eliminad correctamente' });
    } catch (error) { next(error); }
  },
};
