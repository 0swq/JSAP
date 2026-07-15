// @ts-nocheck
import Joi from 'joi';

export const crearEjemplarSchema = Joi.object({
  libroId: Joi.string().uuid().required().messages({
    'any.required': 'El libroId es obligatorio',
  }),
  codigoBarras: Joi.string().max(50).required().messages({
    'any.required': 'El código de barras es obligatorio',
  }),
  estado: Joi.string().valid('disponible', 'prestado', 'perdido', 'mantenimiento').optional(),
  ubicacion: Joi.string().max(100).optional(),
  fechaAdquisicion: Joi.date().iso().optional(),
});

export const actualizarEjemplarSchema = Joi.object({
  libroId: Joi.string().uuid().optional(),
  codigoBarras: Joi.string().max(50).optional(),
  estado: Joi.string().valid('disponible', 'prestado', 'perdido', 'mantenimiento').optional(),
  ubicacion: Joi.string().max(100).optional().allow(null),
  fechaAdquisicion: Joi.date().iso().optional().allow(null),
}).min(1);
