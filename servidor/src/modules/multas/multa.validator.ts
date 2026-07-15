// @ts-nocheck
import Joi from 'joi';

export const crearMultaSchema = Joi.object({
  prestamoId: Joi.string().uuid().required().messages({
    'any.required': 'El prestamoId es obligatorio',
  }),
  monto: Joi.number().positive().required().messages({
    'any.required': 'El monto es obligatorio',
  }),
  diasMora: Joi.number().integer().min(1).required().messages({
    'any.required': 'Los días de mora son obligatorios',
  }),
});

export const actualizarMultaSchema = Joi.object({
  monto: Joi.number().positive().optional(),
  diasMora: Joi.number().integer().min(1).optional(),
  estado: Joi.string().valid('pendiente', 'pagada', 'perdonada').optional(),
}).min(1);

export const filtroMultaSchema = Joi.object({
  estado: Joi.string().valid('pendiente', 'pagada', 'perdonada').optional(),
  usuarioId: Joi.string().optional(),
});
