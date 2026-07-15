// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { pagoMultaServicio } from './pago-multa.service';
import { RespuestaPagoMultaDto } from './pago-multa.dto';

export const pagoMultaControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const pagos: RespuestaPagoMultaDto[] = await pagoMultaServicio.obtenerTodos();
      res.json({ success: true, data: pagos });
    } catch (error) { next(error); }
  },

  async obtenerPorMulta(req: Request, res: Response, next: NextFunction) {
    try {
      const pagos: RespuestaPagoMultaDto[] = await pagoMultaServicio.obtenerPorMulta(req.params.multaId as string);
      res.json({ success: true, data: pagos });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const pago: RespuestaPagoMultaDto = await pagoMultaServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: pago });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const pago: RespuestaPagoMultaDto = await pagoMultaServicio.crear(req.body);
      res.status(201).json({ success: true, data: pago });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const pago: RespuestaPagoMultaDto = await pagoMultaServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: pago });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await pagoMultaServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Pago eliminado correctamente' });
    } catch (error) { next(error); }
  },
};
