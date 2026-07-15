// @ts-nocheck
import Joi from 'joi';

export const crearCategoriaSchema = Joi.object({
  nombre: Joi.string().max(120).required().messages({
    'string.max': 'El nombre no puede superar los 120 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  padreId: Joi.string().uuid().optional(),
  activa: Joi.boolean().optional(),
});

export const actualizarCategoriaSchema = Joi.object({
  nombre: Joi.string().max(120).optional(),
  padreId: Joi.string().uuid().allow(null).optional(),
  activa: Joi.boolean().optional(),
}).min(1);
