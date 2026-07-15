import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ApiError } from '@utils/ApiError';

export const validar = (schema: Schema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const detalles = error.details.map((detalle) => ({
        campo: detalle.path.join('.'),
        mensaje: detalle.message,
      }));

      return next(ApiError.solicitudIncorrecta('Error de validación', detalles));
    }

    req[property] = value;
    next();
  };
};
