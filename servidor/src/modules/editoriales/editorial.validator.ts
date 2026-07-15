// @ts-nocheck
import Joi from 'joi';

export const crearEditorialSchema = Joi.object({
  nombre: Joi.string().max(150).optional(),
  pais: Joi.string().max(100).optional(),
});

export const actualizarEditorialSchema = Joi.object({
  nombre: Joi.string().max(150).optional(),
  pais: Joi.string().max(100).optional(),
}).min(1);
