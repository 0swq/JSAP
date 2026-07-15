// @ts-nocheck
import Joi from 'joi';

export const crearPrestamoSchema = Joi.object({
  usuarioId: Joi.string().required().messages({
    'any.required': 'El usuarioId es obligatorio',
  }),
  ejemplarId: Joi.string().uuid().required().messages({
    'any.required': 'El ejemplarId es obligatorio',
  }),
  fechaMaxDevolucion: Joi.date().iso().required().messages({
    'any.required': 'La fecha máxima de devolución es obligatoria',
  }),
});

export const actualizarPrestamoSchema = Joi.object({
  fechaDevolucion: Joi.date().iso().optional(),
  estado: Joi.string().valid('activo', 'devuelto', 'vencido').optional(),
}).min(1);

export const filtroPrestamoSchema = Joi.object({
  estado: Joi.string().valid('activo', 'devuelto', 'vencido').optional(),
  usuarioId: Joi.string().optional(),
  ejemplarId: Joi.string().uuid().optional(),
});
