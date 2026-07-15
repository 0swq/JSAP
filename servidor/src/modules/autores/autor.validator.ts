// @ts-nocheck
import Joi from 'joi';

export const crearAutorSchema = Joi.object({
  nombre: Joi.string().max(100).optional(),
  apellidos: Joi.string().max(200).required().messages({
    'string.max': 'Los apellidos no pueden superar los 200 caracteres',
    'any.required': 'Los apellidos son obligatorios',
  }),
  nacionalidad: Joi.string().max(100).optional(),
  biografia: Joi.string().optional(),
  fotoUrl: Joi.string().uri().optional(),
  fechaNacimiento: Joi.date().iso().optional(),
});

export const actualizarAutorSchema = Joi.object({
  nombre: Joi.string().max(100).optional(),
  apellidos: Joi.string().max(200).optional(),
  nacionalidad: Joi.string().max(100).optional(),
  biografia: Joi.string().optional(),
  fotoUrl: Joi.string().uri().optional(),
  fechaNacimiento: Joi.date().iso().optional(),
}).min(1);
