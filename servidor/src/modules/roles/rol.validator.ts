// @ts-nocheck
import Joi from 'joi';

export const crearRolSchema = Joi.object({
  nombre: Joi.string().max(50).required().messages({
    'string.max': 'El nombre no puede superar los 50 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  descripcion: Joi.string().max(255).optional(),
});

export const actualizarRolSchema = Joi.object({
  nombre: Joi.string().max(50).optional(),
  descripcion: Joi.string().max(255).optional(),
}).min(1);
